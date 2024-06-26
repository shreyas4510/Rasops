import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import logger from '../../config/logger.js';
import { STATUS_CODE } from '../utils/common.js';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        logger('error', { message: 'Unauthorized access attempted' });
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'TOKEN_NOT_FOUND' });
    }

    jwt.verify(token, env.jwtSecret, (err, user) => {
        if (err) {
            logger('error', { message: 'TOKEN_VERIFICATION_FAILED' });
            return res.status(STATUS_CODE.FORBIDDEN).json({ message: 'TOKEN_VERIFICATION_FAILED' });
        }
        req.user = user;
        logger('info', 'User authenticated successfully', { user });
        next();
    });
};

export default authenticate;
