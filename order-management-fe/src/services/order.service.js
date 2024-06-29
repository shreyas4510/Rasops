import { api, method } from '../api/apiClient';

export const getActiveOrders = async (tableId) => {
    try {
        return await api(method.GET, `/order/active/${tableId}`);
    } catch (error) {
        console.error(`Error while getting active orders ${error}`);
        throw error;
    }
};

export const getCompletedOrders = async ({
    hotelId,
    skip = 0,
    limit = 10,
    sortKey = '',
    sortOrder = '',
    filterKey = '',
    filterValue = ''
}) => {
    try {
        const query = `skip=${skip}&limit=${limit}&sortKey=${sortKey}&sortOrder=${sortOrder}&filterKey=${filterKey}&filterValue=${filterValue}`;
        return await api(method.GET, `/order/completed/${hotelId}?${query}`);
    } catch (error) {
        console.error(`Error while getting completed order details ${error}`);
        throw error;
    }
};

export const updatePendingOrders = async (payload) => {
    try {
        return await api(method.PUT, `/order/pending`, payload);
    } catch (error) {
        console.error(`Error while updating pending order details ${error}`);
        throw error;
    }
};
