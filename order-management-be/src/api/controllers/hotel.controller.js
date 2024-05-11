import { STATUS_CODE } from '../utils/common.js';
import { registerationValidation, updateValidation } from '../validations/hotel.validation.js';
import hotelService from '../services/hotel.service.js';
import logger from '../../config/logger.js';

const register = async (req, res) => {
    try {
        const { body, user } = req;
        logger('debug', 'Registration of hotel request', { body, user });

        // Validating the registration data
        const validation = registerationValidation(body);
        if (validation.error) {
            logger('error', 'Registration validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await hotelService.create(body, user.id);
        logger('info', 'Hotel registration successful', { result });

        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', 'Error occurred during hotel registration', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { body, params } = req;
        logger('debug', 'Update Hotel details request', { body, params });

        const validation = updateValidation(body);
        if (validation.error) {
            logger('error', 'Update validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const { id } = params;
        const result = await hotelService.update(body, id);
        logger('info', 'Hotel update successful', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during hotel update', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const list = async (req, res) => {
    try {
        const { user } = req;
        logger('debug', 'Fetching hotel list for user with ID:', { userId: user.id });

        const result = await hotelService.list(user.id);
        logger('info', 'Hotel list fetched successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during hotel list fetching', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { params } = req;
        logger('debug', `Received request to remove hotel with ID: ${params.id}`);

        const result = await hotelService.remove(params.id);
        logger('info', 'Hotel removed successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error occurred during hotel removal', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    register,
    update,
    list,
    remove
};
