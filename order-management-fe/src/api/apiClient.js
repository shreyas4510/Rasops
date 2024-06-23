import axios from 'axios';
import env from '../config/env';
import store from '../store';
import { setIsLoading } from '../store/slice/app.slice';

const instance = axios.create({
    baseURL: env.baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const ERROR_MESSAGE = ['TOKEN_NOT_FOUND', 'TOKEN_VERIFICATION_FAILED'];

instance.interceptors.request.use(
    (config) => {
        store.dispatch(setIsLoading(true));
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        store.dispatch(setIsLoading(false));
        return Promise.reject(error);
    }
);
instance.interceptors.response.use(
    (response) => {
        store.dispatch(setIsLoading(false));
        return response;
    },
    (error) => {
        if (error.response && ERROR_MESSAGE.includes(error.response.data?.message)) {
            localStorage.clear();
            window.location.replace('/');
        }
        store.dispatch(setIsLoading(false));
        throw error;
    }
);

export const method = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};

export const api = async (method, path, body) => {
    try {
        let res = {};
        switch (method) {
            case 'get':
                res = await instance.get(path);
                break;
            case 'post':
                res = await instance.post(path, body);
                break;
            case 'put':
                res = await instance.put(path, body);
                break;
            case 'delete':
                res = await instance.delete(path, { data: body });
                break;
            default:
                throw new Error('Invalid Method');
        }
        return res.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message);
    }
};
