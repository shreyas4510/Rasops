import { Op, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../config/logger.js';
import { TABLE_STATUS } from '../models/table.model.js';
import tableRepo from '../repositories/table.repository.js';
import { CustomError } from '../utils/common.js';

const create = async (hotelId, payload) => {
    try {
        const { count } = payload;
        const getOptions = {
            where: {
                hotelId
            },
            order: [['tableNumber', 'DESC']],
            attributes: ['tableNumber'],
            limit: 1
        };
        const records = await tableRepo.find(getOptions);
        let startNo = 1;
        if (records.count) {
            startNo = records.rows[0].tableNumber + 1;
        }

        const data = [];
        for (let tableNumber = startNo; tableNumber < startNo + count; tableNumber++) {
            data.push({
                id: uuidv4(),
                hotelId,
                tableNumber
            });
        }
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
        const { filter, hotelId, active } = payload;
        const limit = 50;

        const options = {
            where: {
                hotelId
            }
        };
        const totalCount = await tableRepo.count(options);
        options.order = [['tableNumber', 'ASC']];
        options.attributes = ['id', 'tableNumber'];
        options.limit = limit;
        if (active) {
            options.where.status = TABLE_STATUS[1];
        }

        if (filter) {
            const condition = {
                tableNumber: {
                    // eslint-disable-next-line no-useless-escape
                    [Op.like]: Sequelize.literal(`\'%${filter}%\'`)
                }
            };
            options.where = { ...options.where, ...condition };
        }

        logger('debug', `Fetching table with payload ${JSON.stringify(options)}`);
        const data = await tableRepo.find(options);
        return { ...data, totalCount };
    } catch (error) {
        logger('error', `Error while fetching tables ${error}`);
        throw CustomError(error.code, error.message);
    }
};

const remove = async (hotelId, payload) => {
    try {
        const { count } = payload;
        const options = {
            where: { hotelId },
            limit: count,
            attributes: ['id'],
            order: [['tableNumber', 'DESC']]
        };
        const records = await tableRepo.find(options);
        logger('debug', `Count of the records ${records.count}`);

        const removeOptions = {
            where: {
                id: { [Op.in]: records.rows.map(({ id }) => id) }
            }
        };

        logger('debug', `Removing table with payload ${JSON.stringify(removeOptions)}`);
        await tableRepo.remove(removeOptions);
        return { message: 'Table removed successfully' };
    } catch (error) {
        logger('error', `Error while removing table`, error);
        throw CustomError(error.code, error.message);
    }
};

export default {
    create,
    fetch,
    remove
};
