import { api, method } from '../api/apiClient';

export const registerUser = async (payload) => {
    try {
        return await api(method.POST, '/user/register', payload);
    } catch (error) {
        console.error(`Error to register user ${error}`);
        throw error;
    }
};

export const loginUser = async (payload) => {
    try {
        return await api(method.POST, '/user/login', payload);
    } catch (error) {
        console.error(`Error to login user ${error}`);
        throw error;
    }
};

export const verifyUser = async (payload) => {
    try {
        return await api(method.POST, '/user/verify', payload);
    } catch (error) {
        console.error(`Error to login user ${error}`);
        throw error;
    }
};

export const forgotPasswordUser = async (payload) => {
    try {
        return await api(method.POST, '/user/forget', payload);
    } catch (error) {
        console.error(`Error to login user ${error}`);
        throw error;
    }
};

export const resetPasswordUser = async (payload) => {
    try {
        return await api(method.POST, '/user/reset', payload);
    } catch (error) {
        console.error(`Error to login user ${error}`);
        throw error;
    }
};

export const getUser = async () => {
    try {
        return await api(method.GET, '/user');
    } catch (error) {
        console.error(`Error to login user ${error}`);
        throw error;
    }
};
