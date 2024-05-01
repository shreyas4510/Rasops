import { db } from "../../config/database.js";

const save = async (payload) => {
    try {
        return await db.hotelUserRelation.create(payload);
    } catch (error) {
        const err = error?.errors ? error?.errors[0]?.message : undefined;
        throw CustomError(error.code, ( err || error.message ));
    }
}

export default {
    save
}
