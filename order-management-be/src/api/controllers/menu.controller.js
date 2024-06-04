import logger from '../../config/logger.js';
import menuService from '../services/menu.service.js';
import { STATUS_CODE } from '../utils/common.js';
import {
    createCategoryValidation,
    createValidation,
    updateCategoryValidation,
    updateValidation
} from '../validations/menu.validation.js';

const create = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', 'create a menu ', { body });

        const validation = createValidation(body);
        if (validation.error) {
            logger('error', 'Menu creation validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await menuService.create(body);
        logger('info', 'Menu created successfully', { result });

        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', `Error occurred during creating menu items ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        logger('debug', 'update a menu ', { payload });

        const validation = updateValidation(payload.data);
        if (validation.error) {
            logger('error', 'Menu updation validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await menuService.update(id, payload.hotelId, payload.data);
        logger('info', 'Menu updated successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during updating menu items ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { menuIds } = req.body;
        logger('debug', 'remove a menu item', { menuIds });

        const result = await menuService.remove(menuIds);
        logger('info', 'Menu items removed successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during removing menu items ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const fetch = async (req, res) => {
    try {
        const { params, query } = req;
        const { limit, skip, sortKey, sortOrder, filterKey, filterValue } = query;
        const { id } = params;

        const payload = {
            limit,
            skip,
            sortKey,
            sortOrder,
            filterKey,
            filterValue,
            categoryId: id
        };
        logger('debug', 'Received request to list menu with query:', { query });

        const result = await menuService.fetch(payload);
        logger('info', 'Menu list fetched successfully');

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching menu items ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', 'Create a category ', { body });

        const validation = createCategoryValidation(body);
        if (validation.error) {
            logger('error', 'Category creation validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await menuService.createCategory(body);
        logger('info', 'Category created successfully', { result });

        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', `Error occurred during creating category ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const fetchCategory = async (req, res) => {
    try {
        const { hotelId } = req.params;
        logger('debug', `Fetch categories for hotel ${hotelId}`);

        const result = await menuService.fetchCategory(hotelId);
        logger('info', `Categories for hotel ${hotelId} : ${JSON.stringify(result)}`);

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching categories ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        logger('debug', `Update a category ${JSON.stringify(payload)}`);

        const validation = updateCategoryValidation(payload);
        if (validation.error) {
            logger('error', `Category updation validation error ${validation.error}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await menuService.updateCategory(id, payload);
        logger('info', 'Category updated successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during updating category ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const removeCategory = async (req, res) => {
    try {
        const { categoryIds } = req.body;
        logger('debug', `Remove a category ${categoryIds}`);

        const result = await menuService.removeCategory(categoryIds);
        logger('info', 'Category removed successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during removing category ${error}`);
        return res.status(error.code).send({ message: error.message });
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
