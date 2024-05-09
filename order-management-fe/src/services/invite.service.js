import { api, method } from '../api/apiClient';

export const inviteUser = async (payload) => {
	try {
		return await api(method.POST, '/user/invite', payload);
	} catch (error) {
		console.error(`Error to invite user ${error}`);
		throw error;
	}
};

export const list = async (skip = 0, limit = 10, sortKey = '', sortOrder = '', filterKey = '', filterValue = '') => {
	try {
		const query = `skip=${skip}&limit=${limit}&sortKey=${sortKey}&sortOrder=${sortOrder}&filterKey=${filterKey}&filterValue=${filterValue}`;
		return await api(method.GET, `/user/invite?${query}`);
	} catch (error) {
		console.error(`Error to fetch invite list ${error}`);
		throw error;
	}
};

export const remove = async (id) => {
	try {
		return await api(method.DELETE, `/user/invite/${id}`);
	} catch (error) {
		console.error(`Error in deleting invite ${error}`);
		throw error;
	}
};
