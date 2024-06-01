import { api, method } from '../api/apiClient';

export const createCategories = async (payload) => {
    try {
        return await api(method.POST, `/menu/category`, payload);
    } catch (error) {
        console.error(`Error while creating category ${error}`);
        throw error;
    }
};
