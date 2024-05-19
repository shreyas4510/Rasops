import { v4 as uuidv4 } from 'uuid';
import logger from '../../config/logger.js';
import tableRepo from '../repositories/table.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';

const create = async (payload) => {
    try {
        const { hotelId, tableNumber } = payload;

        const options = {
            where: {
                hotelId,
                tableNumber
            }
        };
        const tables = await tableRepo.find(options);
        if (tables.count) {
            logger('error', `Table already exists try using different table number`);
            throw CustomError(STATUS_CODE.BAD_REQUEST, 'Table already exists try using different table number');
        }

        const data = {
            id: uuidv4(),
            ...options.where
        };
        const res = await tableRepo.save(data);
        logger('debug', `${data.id} Table created successfully`);

        return res;
    } catch (error) {
        logger('error', `Error while table registeration ${payload.hotelId}-${payload.tableId} ${error}`);
        throw CustomError(error.code, error.message);
    }
};

export default {
    create
};
