import { USER_ROLES } from '../models/user.model.js';
import { STATUS_CODE } from '../utils/common.js';

export const ownerAuthentication = (req, res, next) => {
    if (req.user.role !== USER_ROLES[0]) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Access restricted. Limited to owners.' });
    }
    next();
};
