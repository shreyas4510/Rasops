import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { MENU_STATUS } from '../models/menu.model.js';
import { TABLE_STATUS } from '../models/table.model.js';
import customerRepo from '../repositories/customer.repository.js';
import hotelRepo from '../repositories/hotel.repository.js';
import tableRepo from '../repositories/table.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';
import { ORDER_STATUS } from '../models/order.model.js';
import orderRepo from '../repositories/order.repository.js';

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
                }
            ]
        };
        const table = await tableRepo.findOne(options);
        logger('debug', `table details ${JSON.stringify(table)}`);
        if (!table) {
            logger('error', `Table not found for id ${id}`);
            throw CustomError(STATUS_CODE.NOT_FOUND, `Table not found for id ${id}`);
        }

        return table;
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
                price: item.price,
                order: item.orders[0]
            });
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

    return { data, mapping };
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
                            include: [{
                                model: db.orders,
                                where: {
                                    status: ORDER_STATUS[0],
                                    customerId
                                },
                                attributes: ['id', 'price', 'quantity'],
                                required: false
                            }]
                        }
                    ]
                }
            ],
            order: [[db.categories, 'order', 'ASC']]
        };
        logger('debug', 'Fetching hotels details');

        const res = await hotelRepo.find(options);
        const { data: formatedData, mapping } = getMenuCardFormatData(res);

        return {
            id: res.id,
            name: res.name,
            count: Object.keys(formatedData).length,
            data: formatedData,
            mapping
        };
    } catch (error) {
        logger('error', 'Error while detching hotel details', { error });
        throw CustomError(error.code, error.message);
    }
};

const placeOrder = async (payload) => {
    try {
        const { customerId, menus } = payload;

        // Find all orders in pending state
        const previousOrders = {
            where: {
                customerId,
                status: ORDER_STATUS[0]
            }
        }
        const { rows: orders } = await orderRepo.find(previousOrders);
        const existingOrderIds = orders.map(item => item.menuId);

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
                    description: `ADD:Incoming order: ${quantity} x ${menuName}. Let's get cooking!`
                })
            } else {
                const order = orders.find(item => item.menuId === menuId);
                if (order.quantity < quantity) {
                    data.push({
                        id: order.id,
                        menuId,
                        customerId,
                        price: price * quantity,
                        quantity,
                        status: ORDER_STATUS[0],
                        description: `${order.description}#ADD:Added ${quantity - order.quantity} x ${menuName} to the order.`
                    })
                } else {
                    const status = quantity <= 0 ? ORDER_STATUS[2] : ORDER_STATUS[0];
                    const description = quantity <= 0 ? `REMOVE:${order.quantity - quantity} x ${menuName} has been cancelled.` : `REMOVE:Removed ${quantity} x ${menuName} from the order.`;

                    data.push({
                        id: order.id,
                        menuId,
                        customerId,
                        price: price * quantity,
                        quantity,
                        status,
                        description: `${order.description}#${description}`
                    })
                }
            }
        });

        const options = { updateOnDuplicate: ['price', 'quantity', 'description', 'status'] };
        const res = await orderRepo.save(data, options);
        logger('info', 'order operations successful', res);

        return res;
    } catch (error) {
        logger('error', 'Error while placing order', error);
        throw CustomError(error.code, error.message);
    }
}

export default {
    register,
    getTableDetails,
    getMenuDetails,
    placeOrder
};
