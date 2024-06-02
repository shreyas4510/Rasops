import { api, method } from '../api/apiClient';

export const getCategories = async (hotelId) => {
    try {
        return await api(method.GET, `/menu/category/${hotelId}`);
    } catch (error) {
        console.error(`Error while fetching category ${error}`);
        throw error;
    }
};

export const createCategories = async (payload) => {
    try {
        return await api(method.POST, `/menu/category`, payload);
    } catch (error) {
        console.error(`Error while creating category ${error}`);
        throw error;
    }
};

export const updateCategory = async (categoryId, payload) => {
    try {
        return await api(method.PUT, `/menu/category/${categoryId}`, payload);
    } catch (error) {
        console.error(`Error while updating category ${error}`);
        throw error;
    }
};

export const removeCategories = async (payload) => {
    try {
        return await api(method.DELETE, `/menu/category`, payload);
    } catch (error) {
        console.error(`Error while creating category ${error}`);
        throw error;
    }
};
