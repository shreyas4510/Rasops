import { db } from "../../config/database.js";
import { CustomError } from "../utils/common.js";

const save = async (payload) => {
    try {
        return await db.hotel.create(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        throw CustomError(error.code, (err || error.message));
    }
}

const update = async ( options, data ) => {
    try {
        return await db.hotel.update(data, { where: options });
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        throw CustomError(error.code, (err || error.message));
    }
}

const remove = async ( options ) => {
    try {
        return await db.hotel.destroy(options);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        throw CustomError(error.code, (err || error.message));
    }
}

export default {
    save,
    update,
    remove
}
