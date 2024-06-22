import { api, method } from '../api/apiClient';

export const saveBusinessDetail = async (payload) => {
    try {
        return await api(method.POST, `/payment/activate`, payload);
    } catch (error) {
        console.error(`Error while saving businness details ${error}`);
        throw error;
    }
};

export const saveStakeholderDetail = async (payload) => {
    try {
        return await api(method.POST, `/payment/activate`, payload);
    } catch (error) {
        console.error(`Error while saving stakeholder details ${error}`);
        throw error;
    }
};

export const saveBankDetail = async (payload) => {
    try {
        return await api(method.POST, `/payment/activate`, payload);
    } catch (error) {
        console.error(`Error while saving bank details ${error}`);
        throw error;
    }
};
