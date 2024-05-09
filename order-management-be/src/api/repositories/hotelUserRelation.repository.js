import { db } from '../../config/database.js';
import { CustomError, TABLES } from '../utils/common.js';

const includeOptions = (tables) => {
	const options = [];
	tables.forEach((table) => {
		if (table === TABLES.HOTEL) {
			options.push({ model: db.hotel });
		}

		if (table === TABLES.USERS) {
			options.push({ model: db.users });
		}
	});
	return options;
};

const save = async (payload) => {
	try {
		return await db.hotelUserRelation.bulkCreate(payload);
	} catch (error) {
		const err = error?.errors ? error?.errors[0]?.message : undefined;
		throw CustomError(error.code, err || error.message);
	}
};

const find = async (options = {}) => {
	try {
		if (options.include) {
			const include = includeOptions(options.include);
			options = { ...options, include };
		}
		return await db.hotelUserRelation.findAndCountAll(options);
	} catch (error) {
		const err = error?.errors ? error?.errors[0]?.message : undefined;
		throw CustomError(error.code, err || error.message);
	}
};

const remove = async (options) => {
	try {
		return await db.hotelUserRelation.destroy(options);
	} catch (error) {
		const err = error?.errors ? error?.errors[0]?.message : undefined;
		throw CustomError(error.code, err || error.message);
	}
};

export default {
	save,
	find,
	remove
};
