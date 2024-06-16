import axios from 'axios';
import env from '../config/env';
import store from '../store';
import { logoutRequest } from '../store/slice';
import { setIsLoading } from '../store/slice/app.slice';

const instance = axios.create({
    baseURL: env.baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const STATUS_CODES = [401, 403];

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
        if (error.response && STATUS_CODES.includes(error.response.status)) {
            const userId = store.getState().user.data?.id;
            store.dispatch(logoutRequest(userId));
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
