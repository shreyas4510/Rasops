import { v4 as uuidv4 } from 'uuid';
import hotelRepo from "../repositories/hotel.repository.js";
import hotelUserRelationRepo from "../repositories/hotelUserRelation.repository.js";
import userRepo from "../repositories/user.repository.js";
import { CustomError } from "../utils/common.js";
import { USER_ROLES } from '../models/user.model.js';

const create = async (payload, ownerId) => {
    try {
        // Creating a new hotel object with provided payload
        const hotel = {
            id: uuidv4(),
            name: payload.name,
            address: payload.address,
            care_number: payload.care_number,
            open_time: payload.open_time,
            close_time: payload.close_time
        }        // Saving the hotel data
        const data = await hotelRepo.save(hotel);

        // Creating a relation between the owner and the hotel
        const ownerRelation = {
            id: uuidv4(),
            hotelId: data.id,
            userId: ownerId
        }
        await hotelUserRelationRepo.save(ownerRelation);

        let admin = undefined;
        // Creating a relation between the admin and the hotel
        if (payload.admin) {
            const user = await userRepo.findOne({ id: payload.admin });
            if (user?.role === USER_ROLES[1]) {
                const adminRelation = {
                    id: uuidv4(),
                    hotelId: data.id,
                    userId: payload.admin
                }
                await hotelUserRelationRepo.save(adminRelation);
            } else {
                admin = { error: 'admin assigned is invalid' };
            }
        }

        let result = JSON.parse(JSON.stringify(data, null, 4));
        if( admin ) result.admin = { ...admin }

        return result;
    } catch (error) {
        throw CustomError(error.code, error.message);
    }
}

export default {
    create
}
