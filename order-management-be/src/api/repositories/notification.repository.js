import { db } from "../../config/database.js";
import logger from "../../config/logger.js";

const save = async (payload) => {
    try {
        logger('info', `Saving notification for user`, payload);
        return await db.notifications.create(payload);
    } catch (error) {
        const err = error?.errors[0]?.message;
        logger('error', `Error occurred while saving notification: ${err || error.message}`);
        throw CustomError(error.code, err || error.message);
    }
};

export default { save };
