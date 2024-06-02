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

export const fetchMenuItems = async ({
    categoryId,
    skip = 0,
    limit = 10,
    sortKey = '',
    sortOrder = '',
    filterKey = '',
    filterValue = ''
}) => {
    try {
        const query = `skip=${skip}&limit=${limit}&sortKey=${sortKey}&sortOrder=${sortOrder}&filterKey=${filterKey}&filterValue=${filterValue}`;
        return await api(method.GET, `/menu/${categoryId}?${query}`);
    } catch (error) {
        console.error(`Error while fetching menu items ${error}`);
        throw error;
    }
};

export const saveMenuItems = async (payload) => {
    try {
        return await api(method.POST, `/menu`, payload);
    } catch (error) {
        console.error(`Error while storing menu items ${error}`);
        throw error;
    }
};
