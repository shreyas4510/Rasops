import logger from '../../config/logger.js';
import tableService from '../services/table.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { registerValidation } from '../validations/table.validation.js';

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

export default {
    create
};
