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

const update = async (req, res) => {
    try {
        logger('debug', 'Received request to update assigned manager');

        const managerId = req.params.id;
        const ownerId = req.user.id;
        const { prev, current } = req.body;

        logger('debug', `update assigned manager prev hotel : ${ prev }, current hotel : ${ current }, manager : ${managerId}`)
        const result = await managerService.update( prev, current, managerId, ownerId );
        return res.status(STATUS_CODE.OK).send(result);
    } catch (error) {
        logger('error', 'Error while updating managers', { error });
        return res.status(error.code).send({ message: error.message });
    }
}

export default {
    fetch,
    update
};
