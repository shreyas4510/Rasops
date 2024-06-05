import { api, method } from "../api/apiClient";

export const fetch = async (hotelId, filter='') => {
    try {
        return await api(method.GET, `/table/${hotelId}?filter=${filter}`);
    } catch (error) {
        console.error(`Error while fetching tables ${error}`);
        throw error;
    }
};

export const add = async ( hotelId, payload ) => {
    try {
        return await api(method.POST, `/table/${hotelId}`, payload);
    } catch (error) {
        console.error(`Error while adding tables ${error}`);
        throw error;
    }
}

export const remove = async ( hotelId, payload ) => {
    try {
        return await api(method.DELETE, `/table/${hotelId}`, payload);
    } catch (error) {
        console.error(`Error while removing tables ${error}`);
        throw error;
    }
}
