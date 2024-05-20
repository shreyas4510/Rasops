import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../config/database.js';
import logger from '../../config/logger.js';
import categoryRepo from '../repositories/category.repository.js';
import menuRepo from '../repositories/menu.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';

const create = async (payload) => {
    try {
        const options = payload.map((item) => ({ id: uuidv4(), ...item }));
        logger('debug', 'Request to add menu items');
        return await menuRepo.save(options);
    } catch (error) {
        logger('error', 'Error while creating category', { error });
        throw CustomError(error.code, error.message);
    }
};

const update = async (id, payload) => {
    try {
        const options = { where: { id } };
        await menuRepo.update(options, payload);
        return { message: 'Menu Item updated successfully' };
    } catch (error) {
        logger('error', 'Error while updating menu item', { error });
        throw CustomError(error.code, error.message);
    }
};

const createCategory = async (payload) => {
    try {
        const { name, hotelId, order } = payload;
        const checkOptions = {
            where: {
                hotelId,
                [Op.or]: {
                    order,
                    name
                }
            }
        };
        const duplicateCategory = await categoryRepo.find(checkOptions);
        if (duplicateCategory.count) {
            logger('error', `Category name and order should be unique.`);
            throw CustomError(STATUS_CODE.BAD_REQUEST, 'Category name and order should be unique');
        }

        const options = {
            id: uuidv4(),
            name,
            hotelId,
            order
        };

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
            include: [
                {
                    model: db.menu
                }
            ]
        };
        return await categoryRepo.find(options);
    } catch (error) {
        logger('error', `Error while fetching categories ${JSON.stringify(error)}`);
        throw CustomError(error.code, error.message);
    }
};

const updateCategory = async (id, payload) => {
    try {
        const query = {};
        if (payload.name) {
            query.name = payload.name;
        }

        if (payload.order) {
            query.order = payload.order;
        }

        const checkOptions = {
            where: {
                id,
                [Op.or]: { ...query }
            }
        };
        const duplicateCategory = await categoryRepo.find(checkOptions);
        if (duplicateCategory.count) {
            logger('error', `Category name and order should be unique.`);
            throw CustomError(STATUS_CODE.BAD_REQUEST, 'Category name and order should be unique');
        }

        const updateOptions = { where: { id } };
        const updateData = { name: payload.name, order: payload.order };
        await categoryRepo.update(updateOptions, updateData);
        return { message: 'Category updated successfully' };
    } catch (error) {
        logger('error', 'Error while updating category', { error });
        throw CustomError(error.code, error.message);
    }
};

const removeCategory = async (id) => {
    try {
        const options = { where: { id } };
        await categoryRepo.remove(options);

        const menuQuery = { where: { categoryId: id } };
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
    createCategory,
    fetchCategory,
    updateCategory,
    removeCategory
};
