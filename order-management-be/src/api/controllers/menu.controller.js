import logger from '../../config/logger.js';
import menuService from '../services/menu.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { createCategoryValidation } from '../validations/menu.validation.js';

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

export default {
    createCategory
};
