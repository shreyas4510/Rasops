import logger from '../../config/logger.js';
import orderService from '../services/order.service.js';
import { STATUS_CODE } from '../utils/common.js';
import { customerRegistrationSchema } from '../validations/order.validation.js';

const register = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', `Registration of customer request ${JSON.stringify(body)}`);

        // Validating the registration data
        const validation = customerRegistrationSchema(body);
        if (validation.error) {
            logger('error', 'Registration validation error', { error: validation.error });
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await orderService.register(body);
        logger('info', 'Customer registration successful', { result });

        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', 'Error occurred during customer registration', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

const getTableDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await orderService.getTableDetails(id);
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error while fetching table by id ${error}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const getMenuDetails = async (req, res) => {
    try {
        const { hotelId } = req.params;
        logger('debug', `Fetching hotel details for cutomer ${hotelId}`);

        const result = await orderService.getMenuDetails(hotelId);
        logger('info', 'Hotel details fetched successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching hotel details ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    register,
    getTableDetails,
    getMenuDetails
};
