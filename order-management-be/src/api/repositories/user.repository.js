import { db } from "../../config/database.js";
import { CustomError } from "../utils/common.js";

const save = async (payload) => {
    try {
        return await db.users.create(payload);   
    } catch (error) {
        const err = error?.errors[0]?.message;
        throw CustomError(error.code, (err || error.message));
    }
}

const findOne = async ( payload ) => {
    try {
        return await db.users.findOne({ where: payload });   
    } catch (error) {
        const err = error?.errors[0]?.message;
        throw CustomError(error.code, (err || error.message));
    }
}

export default { save, findOne };
