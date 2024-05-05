import { v4 as uuidv4 } from 'uuid';
import hotelRepo from "../repositories/hotel.repository.js";
import hotelUserRelationRepo from "../repositories/hotelUserRelation.repository.js";
import { CustomError, STATUS_CODE, TABLES } from "../utils/common.js";

const create = async (payload, ownerId) => {
    try {
        const maxHotels = 10;
        const ownerHotels = await hotelUserRelationRepo.find({where: { userId: ownerId }})

        if (ownerHotels.count >= maxHotels) {
            throw CustomError(
                STATUS_CODE.TOO_MANY_REQUEST,
                `You've reached the maximum limit for hotel creations. Only 10 hotels per user allowed.`
            );
        }

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
        if (payload.admin && payload.admin.length) {
            const adminRelation = payload.admin.map(item => ({
                id: uuidv4(),
                hotelId: data.id,
                userId: item
            }));
            await hotelUserRelationRepo.save(adminRelation).catch(err => {
                admin = { code: err.code, message: err.message };
            });
        }

        let result = JSON.parse(JSON.stringify(data, null, 4));
        if( admin ) result.admin = { ...admin }

        return result;
    } catch (error) {
        throw CustomError(error.code, error.message);
    }
}

const update = async (payload, id) => {
    try {
        // update the fields
        const data = await hotelRepo.update({ id }, payload);
        return { message:  data ? "Success" : " Failed" };  
    } catch (error) {
        throw CustomError(error.code, error.message);
    }
}

const list = async ( userId ) => {
    try {
        const options = {
            where: { userId },
            include: [ TABLES.HOTEL ]
        };
        const hotels = await hotelUserRelationRepo.find(options);

        const rows = hotels.rows.map(item => item.hotel);
        return { count: hotels.count, rows };
    } catch (error) {
        throw CustomError(error.code, error.message);
    }
}

const remove = async ( hotelId ) => {
    try {
        const result = [];

        // remove hotels
        const hotelOptions = {where: { id: hotelId }};
        await hotelRepo.remove(hotelOptions);
        result.push("Hotel");

        // remove admin and owner ralation with hotel
        const relationOption = { where: { hotelId } };
        await hotelUserRelationRepo.remove(relationOption);
        result.push("Admins and Owners");

        return { message: `${result.join(', ')} removed successfully` };
    } catch (error) {
        throw CustomError(error.code, error.message);
    }
}

export default {
    create,
    update,
    list,
    remove
}
