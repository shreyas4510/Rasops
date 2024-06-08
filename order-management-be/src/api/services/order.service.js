import { v4 as uuidv4 } from 'uuid';
import logger from '../../config/logger.js';
import tableRepo from '../repositories/table.repository.js';
import customerRepo from '../repositories/customer.repository.js';
import { CustomError, STATUS_CODE } from '../utils/common.js';
import { TABLE_STATUS } from '../models/table.model.js';
import { db } from '../../config/database.js';

const register = async (payload) => {
    try {
        logger('debug', `Registering a customer with payload: ${ JSON.stringify(payload) }`);
        const customer = {
            id: uuidv4(),
            ...payload
        };

        logger('debug', `Save customer with details ${ JSON.stringify(customer) }`);
        const data = await customerRepo.save(customer);

        const tableOptions = {
            options: { where: { id: payload.tableId } },
            data: { status: TABLE_STATUS[1], customerId: data.id }
        }
        logger('debug', `Updating table status with `, tableOptions);
        await tableRepo.update(tableOptions.options, tableOptions.data);

        return data;
    } catch (error) {
        logger('error', `Error while creating customer ${ JSON.stringify({ error }) }`);
        throw CustomError(error.code, error.message);
    }
};

const getTableDetails = async (id) => {
    try {
        const options = {
            where: { id },
            attributes: ['id', 'tableNumber', 'status'],
            include: [{
                model: db.customer,
                attributes: ['id', 'name', 'phoneNumber']
            }]
        }
        const table = await tableRepo.findOne(options);
        logger('debug', `table details ${JSON.stringify(table)}`);
        if(!table) {
            logger('error', `Table not found for id ${id}`);
            throw CustomError(STATUS_CODE.NOT_FOUND, `Table not found for id ${id}`);
        }

        return table;
    } catch (error) {
        logger('error', `Error while fetching table by id ${JSON.stringify(error)}`);
        throw CustomError(error.code, error.message);
    }
}

export default {
    register,
    getTableDetails
};
