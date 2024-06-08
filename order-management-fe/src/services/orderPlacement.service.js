import { api, method } from '../api/apiClient';

export const getTableDetail = async (id) => {
    try {
        return await api(method.GET, `/order/table/${id}`);
    } catch (error) {
        console.error(`Error while getting table by id ${error}`);
        throw error;
    }
};

export const registerCustomer = async (payload) => {
    try {
        return await api(method.POST, `/order/customer`, payload);
    } catch (error) {
        console.error(`Error while creating customer ${error}`);
        throw error;
    }
};
