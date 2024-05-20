import logger from '../../config/logger.js';
import tableService from '../services/table.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { fetchTableValidation, registerValidation } from '../validations/table.validation.js';

const create = async (req, res) => {
    try {
        const payload = req.body;
        logger('debug', `Table registeration request ${JSON.stringify(payload)}`);

        const valid = registerValidation(payload);
        if (valid.error) {
            logger('error', `Ragister table validation failed: ${valid.error.message}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await tableService.create(payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error while table registration ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const fetch = async (req, res) => {
    try {
        const { hotelId } = req.body;
        const { filter } = req.query;

        logger('debug', `Fetch table for hotel request ${JSON.stringify(req.body)}`);
        const valid = fetchTableValidation(req.body);
        if (valid.error) {
            logger('error', `Fetch table validation failed: ${valid.error.message}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const payload = {
            filter,
            hotelId
        };
        const result = await tableService.fetch(payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error while fetching tables ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        logger('debug', `Remove table for hotel request ${id}`);

        const result = await tableService.remove(id);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error while deleting tables ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const get = async (req, res) => {
    try {
        const { id } = req.params;
        logger('debug', `Get table for hotel request ${id}`);

        const result = await tableService.get(id);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error while fetching tables ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    create,
    fetch,
    remove,
    get
};
