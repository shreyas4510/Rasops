import { api, method } from '../api/apiClient';

export const getManagers = async () => {
    try {
        return await api(method.GET, `/manager`);
    } catch (error) {
        console.error(`Error while fetching managers ${error}`);
        throw error;
    }
};

export const updateManager = async (payload) => {
    try {
        const { id, data } = payload;
        return await api(method.PUT, `/manager/${id}`, data);
    } catch (error) {
        console.error(`Error while updating manager ${error}`);
        throw error;
    }
};

export const removeManager = async (id) => {
    try {
        return await api(method.DELETE, `/manager/${id}`);
    } catch (error) {
        console.error(`Error in deleting manager ${error}`);
        throw error;
    }
};
