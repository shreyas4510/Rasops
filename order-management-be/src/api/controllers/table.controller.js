import logger from '../../config/logger.js';
import tableService from '../services/table.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { tableValidation } from '../validations/table.validation.js';

const create = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const payload = req.body;
        logger('debug', `Table registeration request ${JSON.stringify(payload)}`);

        const valid = tableValidation(payload);
        if (valid.error) {
            logger('error', `Ragister table validation failed: ${valid.error.message}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await tableService.create(hotelId, payload);
        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', `Error while table registration ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const fetch = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { filter } = req.query;

        logger('debug', `Fetch table for hotel ${hotelId}`);
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
        const { hotelId } = req.params;
        const payload = req.body;
        logger('debug', `Remove table for hotel request ${hotelId}`);

        const valid = tableValidation(payload);
        if (valid.error) {
            logger('error', `Remove table validation failed: ${valid.error.message}`);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await tableService.remove(hotelId, payload);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error while deleting tables ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    create,
    fetch,
    remove
};
