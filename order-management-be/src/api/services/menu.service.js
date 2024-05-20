import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../config/logger.js';
import categoryRepo from '../repositories/category.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';

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
        logger('error', 'Error while creating categiry', { error });
        throw CustomError(error.code, error.message);
    }
};

export default {
    createCategory
};
