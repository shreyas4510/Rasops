import { api, method } from '../api/apiClient';

export const saveBusinessDetails = async (payload) => {
    try {
        return await api(method.POST, `/checkout/business`, payload);
    } catch (error) {
        console.error(`Error while saving businness details ${error}`);
        throw error;
    }
};

export const saveStakeholderDetails = async (payload) => {
    try {
        return await api(method.POST, `/checkout/stakeholder`, payload);
    } catch (error) {
        console.error(`Error while saving stakeholder details ${error}`);
        throw error;
    }
};

export const saveBankDetails = async (payload) => {
    try {
        return await api(method.POST, `/checkout/account`, payload);
    } catch (error) {
        console.error(`Error while saving bank details ${error}`);
        throw error;
    }
};
