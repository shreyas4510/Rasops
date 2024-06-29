import moment from 'moment';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { MENU_STATUS } from '../models/menu.model.js';
import { ORDER_STATUS } from '../models/order.model.js';
import { TABLE_STATUS } from '../models/table.model.js';
import { USER_ROLES } from '../models/user.model.js';
import customerRepo from '../repositories/customer.repository.js';
import hotelRepo from '../repositories/hotel.repository.js';
import hotelUserRelationRepo from '../repositories/hotelUserRelation.repository.js';
import orderRepo from '../repositories/order.repository.js';
import tableRepo from '../repositories/table.repository.js';
import { CustomError, NOTIFICATION_ACTIONS, STATUS_CODE, calculateBill } from '../utils/common.js';
import notificationService from './notification.service.js';

const getNotificationUserIds = async (hotelId) => {
    const notificationOptions = {
        where: { hotelId }
    };
    const { rows } = await hotelUserRelationRepo.find(notificationOptions);
    const userIds = rows.map(({ userId }) => userId);
    logger('debug', 'user ids for notification', userIds);

    return userIds;
};

const register = async (payload) => {
    try {
        logger('debug', `Registering a customer with payload: ${JSON.stringify(payload)}`);
        const customer = {
            id: uuidv4(),
            ...payload
        };

        logger('debug', `Save customer with details ${JSON.stringify(customer)}`);
        const data = await customerRepo.save(customer);

        const tableOptions = {
            options: { where: { id: payload.tableId } },
            data: { status: TABLE_STATUS[1], customerId: data.id }
        };
        logger('debug', `Updating table status with `, tableOptions);
        await tableRepo.update(tableOptions.options, tableOptions.data);

        const userIds = await getNotificationUserIds(payload.hotelId);
        await notificationService.sendNotification(userIds, {
            title: `Table-${payload.tableNumber} Booked`,
            message: `Table-${payload.tableNumber} is booked. Please assist the customer accordingly.`,
            path: 'orders',
            meta: {
                action: NOTIFICATION_ACTIONS.CUSTOMER_REGISTERATION,
                hotelId: payload.hotelId
            }
        });

        return data;
    } catch (error) {
        logger('error', `Error while creating customer ${JSON.stringify({ error })}`);
        throw CustomError(error.code, error.message);
    }
};

const getTableDetails = async (id) => {
    try {
        const options = {
            where: { id },
            attributes: ['id', 'tableNumber', 'status'],
            include: [
                {
                    model: db.customer,
                    attributes: ['id', 'name', 'phoneNumber']
                },
                {
                    model: db.hotel,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: db.hotelUserRelation,
                            attributes: ['userId'],
                            include: [
                                {
                                    model: db.users,
                                    where: { role: USER_ROLES[0] },
                                    attributes: ['id'],
                                    include: [
                                        {
                                            model: db.preferences,
                                            attributes: ['payment']
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: db.subscriptions,
                            attributes: ['subscriptionId', 'endDate']
                        }
                    ]
                }
            ]
        };
        const table = await tableRepo.findOne(options);
        logger('debug', `table details ${JSON.stringify(table)}`);
        if (!table) {
            logger('error', `Table not found for id ${id}`);
            throw CustomError(STATUS_CODE.NOT_FOUND, `Table not found for id ${id}`);
        }

        const subscription = table?.hotel?.subscription;
        if (!subscription || moment().diff(subscription.endDate) > 0) {
            logger('error', 'Hotel Subscription expired.');
            throw CustomError(STATUS_CODE.FORBIDDEN, 'Hotel Subscription expired');
        }

        const result = {
            customer: table.customer,
            id: table.id,
            status: table.status,
            tableNumber: table.tableNumber,
            hotel: {
                id: table.hotel?.id,
                name: table.hotel?.name,
                payment: table.hotel?.hotelUserRelations[0]?.user?.preference?.payment
            }
        };
        logger('debug', `table details ${JSON.stringify(result)}`);
        return result;
    } catch (error) {
        logger('error', `Error while fetching table by id ${JSON.stringify(error)}`);
        throw CustomError(error.code, error.message);
    }
};

const getMenuCardFormatData = ({ id, name, categories }) => {
    const types = {
        cover: 'COVER',
        category: 'CATEGORY',
        item: 'MENU_ITEM'
    };

    const typeData = {
        cover: [{ name, id }]
    };

    const orders = {};
    categories.forEach(({ id: categoryId, name, menus }) => {
        if (!typeData.category) {
            typeData.category = [];
            typeData.menuData = {};
        }

        typeData.category.push({
            name,
            id: categoryId
        });

        const menuItemData = [];
        menus.forEach((item) => {
            menuItemData.push({
                name: item.name,
                id: item.id,
                price: item.price
            });
            if (item.orders[0]) {
                const order = item.orders[0];
                orders[item.id] = {
                    id: item.id,
                    name: item.name,
                    price: order.price,
                    quantity: order.quantity,
                    status: order.status
                };
            }
        });
        typeData.menuData = {
            ...typeData.menuData,
            [`${categoryId}_${name}`]: menuItemData
        };
    });

    const data = {};
    let page = 0;
    data[page] = { type: types.cover, data: typeData.cover[0] };
    page++;

    // Add categories in the menu card details page wise
    const categoriesPerPage = 12;
    const categoriesCount = Math.ceil(typeData.category.length / categoriesPerPage);
    for (let index = page; index < page + categoriesCount; index++) {
        data[index] = {
            title: 'Categories',
            type: types.category,
            data: typeData.category.splice(0, categoriesPerPage)
        };
    }
    page += categoriesCount;

    // add menu items in the menu card details page wise
    const mapping = {};
    const menusPerPage = 10;
    Object.keys(typeData.menuData).forEach((key) => {
        const id = key.split('_')[0];
        const name = key.split('_')[1];
        mapping[id] = page;
        const menuCount = Math.ceil(typeData.menuData[key].length / menusPerPage);
        const menus = typeData.menuData[key];
        for (let index = page; index < page + menuCount; index++) {
            data[index] = { title: name, type: types.item, data: menus.splice(0, menusPerPage) };
        }
        page += menuCount;
    });

    return { data, mapping, orders };
};

const getMenuDetails = async (hotelId, customerId) => {
    try {
        const options = {
            where: { id: hotelId },
            attributes: ['id', 'name'],
            include: [
                {
                    model: db.categories,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: db.menu,
                            where: { status: MENU_STATUS[0] },
                            attributes: ['id', 'name', 'price'],
                            include: [
                                {
                                    model: db.orders,
                                    where: {
                                        status: ORDER_STATUS[0],
                                        customerId
                                    },
                                    attributes: ['id', 'price', 'quantity', 'status'],
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [[db.categories, 'order', 'ASC']]
        };
        logger('debug', 'Fetching hotels details');

        const res = await hotelRepo.find(options);
        const { data: formatedData, mapping, orders } = getMenuCardFormatData(res);

        return {
            id: res.id,
            name: res.name,
            count: Object.keys(formatedData).length,
            data: formatedData,
            mapping,
            orders
        };
    } catch (error) {
        logger('error', 'Error while detching hotel details', { error });
        throw CustomError(error.code, error.message);
    }
};

const placeOrder = async (payload) => {
    try {
        const { customerId, menus, hotelId } = payload;

        // Find all orders in pending state
        const previousOrders = {
            where: {
                customerId,
                status: {
                    [Op.ne]: ORDER_STATUS[3]
                }
            }
        };
        const { rows: orders } = await orderRepo.find(previousOrders);
        let edited = 0;
        const existingOrderIds = orders.reduce((cur, next) => {
            edited = Math.max(edited, next.edited);
            if (next.status === ORDER_STATUS[0]) {
                cur.push(next.menuId);
            }
            return cur;
        }, []);
        edited++;

        // add new fresh orders and update existing ones
        const data = [];
        menus.forEach(({ menuId, menuName, quantity, price }) => {
            if (!existingOrderIds.includes(menuId)) {
                if (!quantity) return;
                data.push({
                    id: uuidv4(),
                    menuId,
                    customerId,
                    price: price * quantity,
                    quantity,
                    status: ORDER_STATUS[0],
                    description: `${edited}-ADD:Incoming order: ${quantity} x ${menuName}. Let's get cooking!`,
                    edited
                });
            } else {
                const order = orders.find((item) => item.menuId === menuId);
                if (order.quantity < quantity) {
                    data.push({
                        id: order.id,
                        menuId,
                        customerId,
                        price: price * quantity,
                        quantity,
                        status: ORDER_STATUS[0],
                        description: `${order.description}#${edited}-ADD:Added ${quantity - order.quantity} x ${menuName} to the order.`,
                        edited
                    });
                }

                if (order.quantity > quantity) {
                    const status = quantity <= 0 ? ORDER_STATUS[2] : ORDER_STATUS[0];
                    const description =
                        quantity <= 0
                            ? `${edited}-REMOVE:${order.quantity - quantity} x ${menuName} has been cancelled.`
                            : `${edited}-REMOVE:Removed ${order.quantity - quantity} x ${menuName} from the order.`;

                    data.push({
                        id: order.id,
                        menuId,
                        customerId,
                        price: price * quantity,
                        quantity,
                        status,
                        description: `${order.description}#${description}`,
                        edited
                    });
                }
            }
        });

        const options = { updateOnDuplicate: ['price', 'quantity', 'description', 'status', 'edited'] };
        const res = await orderRepo.save(data, options);
        logger('info', 'order operations successful', res);

        const userIds = await getNotificationUserIds(hotelId);
        await notificationService.sendNotification(userIds, {
            title: `Order Updates`,
            message: `Table-${payload.tableNumber} order is placed / updated.`,
            path: 'orders',
            meta: {
                action: NOTIFICATION_ACTIONS.ORDER_PLACEMENT,
                tableId: payload.tableId
            }
        });

        return res;
    } catch (error) {
        logger('error', 'Error while placing order', error);
        throw CustomError(error.code, error.message);
    }
};

const getOrder = async (customerId) => {
    try {
        const options = {
            where: {
                customerId,
                status: {
                    [Op.in]: [ORDER_STATUS[0], ORDER_STATUS[1]]
                }
            },
            attributes: ['id', 'price', 'quantity', 'status'],
            include: [
                {
                    model: db.menu,
                    attributes: ['id', 'name', 'price']
                }
            ]
        };
        logger('debug', `Get order details for customer ${customerId} with options`, options);
        return await orderRepo.find(options);
    } catch (error) {
        logger('error', 'Error while get order details', { error });
        throw CustomError(error.code, error.message);
    }
};

const payment = async ({ customerId, manual }) => {
    try {
        const options = {
            where: {
                customerId,
                status: ORDER_STATUS[1]
            }
        };
        const orders = await orderRepo.find(options);
        const price = orders.reduce((cur, next) => {
            cur += next.price;
            return cur;
        }, 0);

        const { totalPrice } = calculateBill(price);
        logger('info', `total price for ${customerId} - ${totalPrice}`);
        if (manual) {
            // TODO: send notification to manager to accept the payment
        } else {
            // TODO: send payment through to Razorpay
        }

        return { message: 'Success' };
    } catch (error) {
        logger('error', 'Error while order payment ', { error });
        throw CustomError(error.code, error.message);
    }
};

const paymentConfirmation = async (customerId) => {
    try {
        const orderOptions = {
            options: { where: { customerId } },
            data: { status: ORDER_STATUS[3] }
        };
        const orderRes = await orderRepo.update(orderOptions.options, orderOptions.data);
        logger('debug', 'Order updated response', orderRes);

        const tableOptions = {
            options: { where: { customerId } },
            data: { status: TABLE_STATUS[0], customerId: null }
        };
        const tableRes = await tableRepo.update(tableOptions.options, tableOptions.data);
        logger('debug', 'Table details updated', tableRes);

        return { message: 'Success' };
    } catch (error) {
        logger('error', 'Error while order payment confirmation', { error });
        throw CustomError(error.code, error.message);
    }
};

const feedback = async ({ customerId, feedback, rating }) => {
    try {
        const options = { where: { id: customerId } };
        const data = { feedback, rating };
        logger('debug', 'options and data for customer feedback', { options, data });

        return await customerRepo.update(options, data);
    } catch (error) {
        logger('error', 'Error while get order details', { error });
        throw CustomError(error.code, error.message);
    }
};

const active = async (tableId) => {
    try {
        const options = {
            where: { id: tableId },
            attributes: ['id', 'customerId'],
            include: [
                {
                    model: db.customer,
                    attributes: ['id'],
                    include: [
                        {
                            model: db.orders,
                            where: {
                                status: {
                                    [Op.notIn]: [ORDER_STATUS[3]]
                                }
                            },
                            include: [
                                {
                                    model: db.menu
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        const activeOrders = await tableRepo.findOne(options);
        logger('debug', `active orders for table ${tableId}`, activeOrders);

        if (!activeOrders.customer) {
            logger('info', `No active orders for table ${tableId}`);
            return { message: 'No active orders' };
        }

        const orders = activeOrders.customer?.orders;
        if (!orders.length) {
            logger('info', `Customer has not ordered yet for table ${tableId}`);
            return { message: 'No active orders' };
        }

        const data = orders.reduce(
            (cur, next) => {
                if (next.status === ORDER_STATUS[0]) {
                    cur.bill = false;
                }

                if (next.status === ORDER_STATUS[0]) {
                    cur.pendingOrder[next.id] = { name: next.menu.name, quantity: next.quantity };
                }

                if (next.status === ORDER_STATUS[1]) {
                    cur.billDetails.menu.push({
                        name: next.menu.name,
                        quantity: next.quantity,
                        price: next.price
                    });
                    cur.billDetails.price += next.price;
                }

                const descriptions = next.description.split('#');
                descriptions.forEach((des) => {
                    const i = Number(des[0]) - 1;
                    if (!cur.description[i]) cur.description[i] = [];
                    cur.description[i].push({
                        description: des.substring(des.indexOf('-') + 1).trim(),
                        status: next.status
                    });
                });
                return cur;
            },
            {
                bill: true,
                pendingOrder: {},
                billDetails: { menu: [], price: 0 },
                description: []
            }
        );

        if (data.bill) {
            data.billDetails.id = activeOrders.customer.id;

            const { cgst, sgst, totalPrice } = calculateBill(data.billDetails.price);
            data.billDetails.sgst = sgst;
            data.billDetails.cgst = cgst;
            data.billDetails.totalPrice = totalPrice;
            data.billDetails.paymentId = orders[0].razorpayPaymentId;
        } else {
            data.billDetails = {};
        }
        logger('debug', `Active order details for table ${tableId}`, data);
        return data;
    } catch (error) {
        logger('error', 'Error while fetching active orders', { error });
        throw CustomError(error.code, error.message);
    }
};

const updatePending = async (orders) => {
    try {
        const options = {
            where: {
                id: { [Op.in]: orders }
            }
        };
        const data = { status: ORDER_STATUS[1] };
        logger('debug', 'options and data for updating pending orders', { options, data });

        return await orderRepo.update(options, data);
    } catch (error) {
        logger('error', 'Error while get order details', { error });
        throw CustomError(error.code, error.message);
    }
};

const completed = async (hotelId, filters) => {
    try {
        const { limit, skip, sortKey, sortOrder, filterKey, filterValue } = filters;
        const defaults = {
            sortKey: 'updatedAt',
            sortOrder: 'DESC',
            limit: 10,
            offset: 0
        };

        const options = {
            where: { hotelId },
            distinct: true,
            attributes: ['id', 'name', 'email', 'phoneNumber', 'feedback', 'rating'],
            include: [
                {
                    model: db.orders,
                    where: {
                        status: ORDER_STATUS[3],
                        quantity: { [Op.gt]: 0 }
                    },
                    attributes: ['price', 'quantity', 'razorpayPaymentId'],
                    include: [
                        {
                            model: db.menu,
                            attributes: ['name']
                        }
                    ]
                }
            ],
            limit: Number(limit) || defaults.limit,
            offset: Number(skip) || defaults.offset
        };

        if (filterKey && filterValue) {
            options.where = {
                [filterKey]: {
                    [Op.like]: `%${filterValue}%`
                }
            };
        }

        if (sortKey && sortOrder) {
            options.order = [[sortKey || defaults.sortKey, sortOrder || defaults.sortOrder]];
        }
        logger('debug', 'Options to fetch completed orders', options);
        const customers = await customerRepo.find(options);

        const data = [];
        customers.rows.forEach((item) => {
            const { orders } = item;
            const obj = {
                id: item.id,
                name: item.name,
                email: item.email,
                phoneNumber: item.phoneNumber,
                feedback: item.feedback,
                rating: item.rating,
                menu: []
            };

            let price = 0;
            orders.forEach((menuItem) => {
                obj.menu.push({
                    name: menuItem.menu.name,
                    price: menuItem.price,
                    quantity: menuItem.quantity
                });
                price += menuItem.price;
            });

            obj.price = price;
            const { cgst, sgst, totalPrice } = calculateBill(price);
            obj.sgst = sgst;
            obj.cgst = cgst;
            obj.totalPrice = totalPrice;
            obj.paymentId = item.razorpayPaymentId;
            data.push(obj);
        });
        return { data, count: customers.count };
    } catch (error) {
        logger('error', 'Error while get completed order details', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    register,
    getTableDetails,
    getMenuDetails,
    placeOrder,
    getOrder,
    payment,
    paymentConfirmation,
    feedback,
    active,
    updatePending,
    completed
};
