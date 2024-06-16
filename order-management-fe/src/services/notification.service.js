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
