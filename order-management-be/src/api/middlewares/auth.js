import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import { STATUS_CODE } from '../utils/common.js';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, env.jwtSecret, (err, user) => {
        if (err) {
            return res.status(STATUS_CODE.FORBIDDEN).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

export default authenticate;
