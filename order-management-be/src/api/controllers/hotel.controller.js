import { STATUS_CODE } from "../utils/common.js";
import { registerationValidation } from "../validations/hotel.validation.js";
import hotelService from "../services/hotel.service.js";

const register = async (req, res) => {
    try {
        const { body, user } = req;

        // Validating the registration data
        const validation = registerationValidation(body);
        if (validation.error) {
            return res.status(STATUS_CODE.BAD_REQUEST).send({ message: validation.error.message });
        }

        const result = await hotelService.create(body, user.id);
        res.status(STATUS_CODE.CREATED).send(result);
    } catch (error) {
        console.log(`Failed to create hotel ${error}`);
        res.status(error.code).send({ message: error.message });
    }
}

export default {
    register
}
