import { Op, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../config/logger.js';
import { MENU_STATUS } from '../models/menu.model.js';
import categoryRepo from '../repositories/category.repository.js';
import menuRepo from '../repositories/menu.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';

const create = async (payload) => {
    try {
        const { categoryId, hotelId, data } = payload;
        const options = data.map((item) => ({ id: uuidv4(), categoryId, hotelId, ...item }));
        logger('debug', 'Request to add menu items');
        return await menuRepo.save(options);
    } catch (error) {
        logger('error', 'Error while creating category', { error });
        throw CustomError(error.code, error.message);
    }
};

const update = async (id, hotelId, payload) => {
    try {
        if (payload.name) {
            const duplicateOptions = {
                where: {
                    hotelId,
                    name: payload.name
                }
            };
            const res = await menuRepo.find(duplicateOptions);
            if (res.count) {
                logger('error', `Menu item already exists ${payload.name}`);
                throw CustomError(STATUS_CODE.CONFLICT, 'Name already exists');
            }
        }

        if (payload.status !== undefined) {
            payload.status = payload.status ? MENU_STATUS[0] : MENU_STATUS[1];
        }
        const options = { where: { id } };
        await menuRepo.update(options, payload);
        return { message: 'Menu Item updated successfully' };
    } catch (error) {
        logger('error', 'Error while updating menu item', { error });
        throw CustomError(error.code, error.message);
    }
};

const remove = async (menuIds) => {
    try {
        const options = {
            where: {
                id: { [Op.in]: menuIds }
            }
        };
        await menuRepo.remove(options);
        return { message: 'Menu Items removed successfully' };
    } catch (error) {
        logger('error', 'Error while removing menu item', { error });
        throw CustomError(error.code, error.message);
    }
};

const fetch = async (payload) => {
    try {
        const {
            categoryId,
            limit = 10,
            skip = 0,
            sortKey = 'updatedAt',
            sortOrder = 'DESC',
            filterKey,
            filterValue
        } = payload;

        const options = {
            where: { categoryId },
            limit: Number(limit),
            offset: Number(skip)
        };

        if (sortKey && sortOrder) {
            options.order = [[sortKey, sortOrder]];
        }

        if (filterKey && filterValue) {
            options.where = {
                [Op.and]: [
                    { categoryId },
                    {
                        [filterKey]: {
                            // eslint-disable-next-line no-useless-escape
                            [Op.like]: Sequelize.literal(`\'%${filterValue}%\'`)
                        }
                    }
                ]
            };
        }

        logger('debug', `Fetching menu items with options ${JSON.stringify(options)}`);
        const data = await menuRepo.find(options);

        logger('debug', `Menu items fetched successfully ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        logger('error', `Error while fetching menu items ${JSON.stringify(error)}`);
        throw CustomError(error.code, error.message);
    }
};

const createCategory = async (payload) => {
    try {
        const { hotelId, data } = payload;
        const options = data.map(({ name, order }) => ({
            id: uuidv4(),
            name,
            hotelId,
            order
        }));

        logger('info', `Options to add new Categories ${JSON.stringify(options)}`);
        const result = await categoryRepo.save(options);
        return result;
    } catch (error) {
        logger('error', 'Error while creating category', { error });
        throw CustomError(error.code, error.message);
    }
};

const fetchCategory = async (hotelId) => {
    try {
        const options = {
            where: { hotelId },
            order: [['order', 'ASC']]
        };
        return await categoryRepo.find(options);
    } catch (error) {
        logger('error', `Error while fetching categories ${JSON.stringify(error)}`);
        throw CustomError(error.code, error.message);
    }
};

const updateCategory = async (id, payload) => {
    try {
        const updateData = {};
        if (payload.name) {
            updateData.name = payload.name;
        }

        if (payload.order) {
            updateData.order = payload.order;
        }

        const updateOptions = { where: { id } };
        await categoryRepo.update(updateOptions, updateData);
        return { message: 'Category updated successfully' };
    } catch (error) {
        logger('error', 'Error while updating category', { error });
        throw CustomError(error.code, error.message);
    }
};

const removeCategory = async (categoryIds) => {
    try {
        const options = {
            where: {
                id: { [Op.in]: categoryIds }
            }
        };
        await categoryRepo.remove(options);

        const menuQuery = {
            where: {
                categoryId: { [Op.in]: categoryIds }
            }
        };
        await menuRepo.remove(menuQuery);

        return { message: 'Category removed successfully' };
    } catch (error) {
        logger('error', 'Error while removing category', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    create,
    update,
    remove,
    fetch,
    createCategory,
    fetchCategory,
    updateCategory,
    removeCategory
};
