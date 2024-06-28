import { api, method } from '../api/apiClient';

export const getActiveOrders = async (tableId) => {
    try {
        return await api(method.GET, `/order/active/${tableId}`);
    } catch (error) {
        console.error(`Error while getting active orders ${error}`);
        throw error;
    }
};

export const getCompletedOrders = async (tableId) => {
    try {
        return await api(method.GET, `/order/completed/${tableId}`);
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
