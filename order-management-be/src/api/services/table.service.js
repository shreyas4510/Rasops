import { Op } from 'sequelize';
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

const fetch = async (payload) => {
    try {
        const { filter, hotelId } = payload;
        const limit = 50;

        const options = {
            where: {
                hotelId
            },
            attribute: ['id', 'tableNumber'],
            limit
        };

        if (filter) {
            const condition = { tableNumber: { [Op.like]: `%${filter}%` } };
            options.where = { ...options.where, ...condition };
        }

        logger('debug', `Fetching table with payload ${JSON.stringify(options)}`);
        const data = await tableRepo.find(options);
        return data;
    } catch (error) {
        logger('error', `Error while fetching tables ${error}`);
        throw CustomError(error.code, error.message);
    }
};

const remove = async (id) => {
    try {
        const options = { where: { id } };
        logger('debug', `Removing table with payload ${JSON.stringify(options)}`);

        await tableRepo.remove(options);
        return { message: 'Table removed successfully' };
    } catch (error) {
        logger('error', `Error while removing table ${id}`);
        throw CustomError(error.code, error.message);
    }
};

export default {
    create,
    fetch,
    remove
};
