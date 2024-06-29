import logger from '../../config/logger.js';
import orderService from '../services/order.service.js';
import { STATUS_CODE } from '../utils/common.js';
import {
    customerRegistrationValidation,
    feedbackValidation,
    orderPlacementValidation
} from '../validations/order.validation.js';

const register = async (req, res) => {
    try {
        const { body } = req;
        logger('debug', `Registration of customer request ${JSON.stringify(body)}`);

        // Validating the registration data
        const validation = customerRegistrationValidation(body);
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
        const { hotelId, customerId } = req.query;
        logger('debug', `Fetching hotel details for cutomer ${hotelId}`);

        const result = await orderService.getMenuDetails(hotelId, customerId);
        logger('info', 'Hotel details fetched successfully', { result });

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching hotel details ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const placeOrder = async (req, res) => {
    try {
        const payload = req.body;
        logger('debug', `Place order details`, payload);

        const valid = orderPlacementValidation(payload);
        if (valid.error) {
            logger('error', `Order placement validation failed`, valid.error);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await orderService.placeOrder(payload);
        logger('info', 'Order placed successfully', { result });

        return res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        logger('error', `Error occurred during placing order ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const { customerId } = req.params;
        logger('debug', `Get order details for customer ${customerId}`);

        const result = await orderService.getOrder(customerId);
        logger('debug', `Get order details response`, result);

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching order ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const feedback = async (req, res) => {
    try {
        const payload = req.body;
        logger('debug', `Request for feedback for customer`, payload);

        const valid = feedbackValidation(payload);
        if (valid.error) {
            logger('error', `Feedback validation failed`, valid.error);
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: valid.error.message });
        }

        const result = await orderService.feedback(payload);
        logger('debug', `Order feedback response`, result);

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during feedback ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const active = async (req, res) => {
    try {
        const { tableId } = req.params;
        logger('debug', `Request for fetching active orders for ${tableId}`);

        const result = await orderService.active(tableId);
        logger('debug', `Active orders response`, result);

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching active orders ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const updatePending = async (req, res) => {
    try {
        const { orders, customerId } = req.body;
        logger('debug', `Request for updating pending orders`, orders);

        const result = await orderService.updatePending(orders, customerId);
        logger('debug', `Updated orders successfully`, orders);

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during updating pending orders ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

const completed = async (req, res) => {
    try {
        const { hotelId } = req.params;
        logger('debug', `Request for fetching completed orders ${hotelId}`);

        const filters = req.query;
        const result = await orderService.completed(hotelId, filters);
        logger('debug', `Completed orders fetched successfully`, result);

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', `Error occurred during fetching completed orders ${JSON.stringify(error)}`);
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    register,
    getTableDetails,
    getMenuDetails,
    placeOrder,
    getOrder,
    feedback,
    active,
    updatePending,
    completed
};
