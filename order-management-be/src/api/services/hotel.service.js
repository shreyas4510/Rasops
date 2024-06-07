import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import { MENU_STATUS } from '../models/menu.model.js';
import hotelRepo from '../repositories/hotel.repository.js';
import hotelUserRelationRepo from '../repositories/hotelUserRelation.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';

const create = async (payload, ownerId) => {
    try {
        logger('debug', 'Creating a new hotel with payload:', { payload, ownerId });

        const maxHotels = 10;
        const ownerHotels = await hotelUserRelationRepo.find({
            where: { userId: ownerId }
        });

        if (ownerHotels.count >= maxHotels) {
            logger('error', 'Max limit for hotel creations reached', { ownerId });
            throw CustomError(
                STATUS_CODE.TOO_MANY_REQUEST,
                `You've reached the maximum limit for hotel creations. Only 10 hotels per user allowed.`
            );
        }

        // Creating a new hotel object with provided payload
        const hotel = {
            id: uuidv4(),
            name: payload.name,
            address: payload.address,
            careNumber: payload.careNumber,
            openTime: payload.openTime,
            closeTime: payload.closeTime
        }; // Saving the hotel data

        logger('debug', 'Save hotel with details', { hotel });
        const data = await hotelRepo.save(hotel);

        // Creating a relation between the owner and the hotel
        const ownerRelation = {
            id: uuidv4(),
            hotelId: data.id,
            userId: ownerId
        };

        logger('debug', 'Create Owner and hotel relation', { ownerRelation });
        await hotelUserRelationRepo.save([ownerRelation]);

        let manager;
        // Creating a relation between the manager and the hotel
        if (payload.manager && payload.manager.length) {
            const managerRelation = payload.manager.map((item) => ({
                id: uuidv4(),
                hotelId: data.id,
                userId: item
            }));
            logger('debug', 'Create Managers and hotel relation', { managerRelation });
            await hotelUserRelationRepo.save(managerRelation).catch((err) => {
                manager = { code: err.code, message: err.message };
            });
        }

        const result = JSON.parse(JSON.stringify(data, null, 4));
        if (manager) result.manager = { ...manager };

        return result;
    } catch (error) {
        logger('error', 'Error while creating hotel', { error });
        throw CustomError(error.code, error.message);
    }
};

const update = async (payload, id) => {
    try {
        const { manager, ...rest } = payload;
        logger('debug', 'Updating hotel with ID:', { id, payload });
        const data = await hotelRepo.update({ id }, rest);

        if (manager.removed?.length) {
            const options = {
                where: {
                    hotelId: id,
                    userId: {
                        [Op.in]: manager.removed
                    }
                }
            };
            await hotelUserRelationRepo.remove(options);
        }

        if (manager.added?.length) {
            const managerRelation = manager.added.map((item) => ({
                id: uuidv4(),
                hotelId: id,
                userId: item
            }));
            await hotelUserRelationRepo.save(managerRelation);
        }

        return { message: data ? 'Hotel details updated successfully' : ' Failed to update hotel details' };
    } catch (error) {
        logger('error', 'Error while updating hotel', { error });
        throw CustomError(error.code, error.message);
    }
};

const list = async (userId) => {
    try {
        const options = {
            where: { userId },
            include: [
                {
                    model: db.hotel,
                    include: [
                        {
                            model: db.hotelUserRelation,
                            where: { userId: { [Op.ne]: userId } },
                            include: [
                                {
                                    model: db.users
                                }
                            ],
                            separate: true
                        }
                    ]
                }
            ]
        };
        logger('debug', 'Fetching hotels for user', { options });
        const hotels = await hotelUserRelationRepo.find(options);

        logger('info', `Hotels of owner ${JSON.stringify(hotels)}`);
        const rows = hotels.rows.reduce((cur, next) => {
            const { hotel } = next;
            const obj = {
                id: hotel.id,
                name: hotel.name,
                openTime: hotel.openTime,
                closeTime: hotel.closeTime,
                address: hotel.address,
                careNumber: hotel.careNumber,
                rating: hotel.rating,
                createdAt: hotel.createdAt,
                managers: {}
            };

            if (hotel.hotelUserRelations && hotel.hotelUserRelations.length) {
                const managers = hotel.hotelUserRelations.map((item) => ({
                    id: item.user.id,
                    name: `${item.user.firstName} ${item.user.lastName}`
                }));
                obj.managers = managers;
            }
            cur.push(obj);
            return cur;
        }, []);

        const data = { count: hotels.count, rows };
        return data;
    } catch (error) {
        logger('error', 'Error while listing hotels', { error });
        throw CustomError(error.code, error.message);
    }
};

const remove = async (hotelId) => {
    try {
        const result = [];

        // remove hotels
        const hotelOptions = { where: { id: hotelId } };
        logger('debug', 'Removing hotel with options', { hotelOptions });

        await hotelRepo.remove(hotelOptions);
        result.push('Hotel');

        // remove manager and owner ralation with hotel
        const relationOption = { where: { hotelId } };
        logger('debug', 'Removing hotel relations with options', { relationOption });

        await hotelUserRelationRepo.remove(relationOption);
        result.push('Managers and Owners');

        return { message: `${result.join(', ')} removed successfully` };
    } catch (error) {
        logger('error', 'Error while removing hotel', { hotelId, error });
        throw CustomError(error.code, error.message);
    }
};

const getMenuCardFormatData = ({ id, name, categories }) => {
    const types = {
        cover: 'COVER',
        category: 'CATEGORY',
        title: 'TITLE',
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
                price: item.price
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

const getDetails = async (hotelId) => {
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
                            attributes: ['id', 'name', 'price']
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

export default {
    create,
    update,
    list,
    remove,
    getDetails
};
