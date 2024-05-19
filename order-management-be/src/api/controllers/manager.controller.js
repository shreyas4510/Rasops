import logger from '../../config/logger.js';
import managerService from '../services/manager.service.js';
import { STATUS_CODE } from '../utils/common.js';

const fetch = async (req, res) => {
    try {
        const { query } = req;
        const { limit, skip, sortKey, sortOrder, filterKey, filterValue } = query;

        const payload = {
            limit,
            skip,
            sortKey,
            sortOrder,
            filterKey,
            filterValue,
            owner: req.user.id
        };
        logger('debug', 'Received request to list managers with query:', { query });

        const result = await managerService.fetch(payload);
        logger('info', 'List of mangers fetched successfully');

        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error while fetching managers', { error });
        return res.status(error.code).send({ message: error.message });
    }
};

export default {
    fetch
};
