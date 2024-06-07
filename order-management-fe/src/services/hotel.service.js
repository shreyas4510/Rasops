import { api, method } from '../api/apiClient';

export const create = async (payload) => {
    try {
        return await api(method.POST, '/hotel', payload);
    } catch (error) {
        console.error(`Error while creating hotel ${error}`);
        throw error;
    }
};

export const fetch = async () => {
    try {
        return await api(method.GET, '/hotel');
    } catch (error) {
        console.error(`Error while fetching hotel ${error}`);
        throw error;
    }
};

export const remove = async (id) => {
    try {
        return await api(method.DELETE, `/hotel/${id}`);
    } catch (error) {
        console.error(`Error while removing hotel ${error}`);
        throw error;
    }
};

export const update = async (payload) => {
    try {
        const { id, data } = payload;
        return await api(method.PUT, `/hotel/${id}`, data);
    } catch (error) {
        console.error(`Error while updating hotel ${error}`);
        throw error;
    }
};

export const fetchAssignableManager = async () => {
    try {
        return await api(method.GET, '/manager/assignable');
    } catch (error) {
        console.error(`Error while fetching assignable manager ${error}`);
        throw error;
    }
};

export const getDetails = async (hotelId) => {
    try {
        return await api(method.GET, `/hotel/${hotelId}`);
    } catch (error) {
        console.error(`Error while fetching assignable manager ${error}`);
        throw error;
    }
};
