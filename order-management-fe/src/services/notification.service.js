import { api, method } from '../api/apiClient';

export const subscribe = async (payload) => {
    try {
        return await api(method.POST, `/notification/subscribe`, payload);
    } catch (error) {
        console.error(`Error while subscribing notifications ${error}`);
        throw error;
    }
};

export const unsubscribe = async () => {
    try {
        return await api(method.POST, `/notification/unsubscribe`);
    } catch (error) {
        console.error(`Error while un-subscribing notifications ${error}`);
        throw error;
    }
};

export const fetch = async () => {
    try {
        return await api(method.GET, `/notification`);
    } catch (error) {
        console.error(`Error while fetching notifications ${error}`);
        throw error;
    }
};

export const update = async () => {
    try {
        return await api(method.PUT, `/notification`);
    } catch (error) {
        console.error(`Error while updating notifications ${error}`);
        throw error;
    }
};
