import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/hotel.service';
import {
    getHotelRequest,
    getHotelSuccess,
    removeHotelSuccess,
    setAssignableManagers,
    setHotelFormData
} from '../slice';
import {
    CREATE_HOTEL_REQUEST,
    GET_ASSIGNABLE_MANAGER,
    GET_HOTEL_REQUEST,
    REMOVE_HOTEL_REQUEST,
    UPDATE_HOTEL_REQUEST
} from '../types';

function* createHotelRequestSaga(action) {
    try {
        const data = action.payload;
        yield service.create(data);
        toast.success('Hotel Created successfully');
        yield put(getHotelRequest());
        yield put(setHotelFormData(false));
    } catch (error) {
        toast.error(`Failed to create hotel ${error?.message}`);
    }
}

function* getHotelsRequestSaga() {
    try {
        const res = yield service.fetch();
        yield put(getHotelSuccess(res));
    } catch (error) {
        toast.error('Failed to fetch hotels', error.message);
    }
}

function* removeHotelsRequestSaga(action) {
    try {
        const id = action.payload;
        const res = yield service.remove(id);
        toast.success(res.message);
        yield put(removeHotelSuccess(id));
    } catch (error) {
        toast.error('Failed to remove hotels', error.message);
    }
}

function* updateHotelsRequestSaga(action) {
    try {
        const res = yield service.update(action.payload);
        toast.success(res.message);
        yield put(getHotelRequest());
        yield put(setHotelFormData(false));
    } catch (error) {
        toast.error('Failed to update hotels', error.message);
        yield put(setHotelFormData(false));
    }
}

function* getAssignableManagerSaga() {
    try {
        const res = yield service.fetchAssignableManager();
        yield put(
            setAssignableManagers(
                res?.rows?.map((row) => {
                    return { label: row?.name, value: row?.id };
                })
            )
        );
    } catch (error) {
        toast.error('Failed to fetch hotels', error.message);
    }
}

export default function* hotelSaga() {
    yield all([
        takeLatest(CREATE_HOTEL_REQUEST, createHotelRequestSaga),
        takeLatest(GET_HOTEL_REQUEST, getHotelsRequestSaga),
        takeLatest(REMOVE_HOTEL_REQUEST, removeHotelsRequestSaga),
        takeLatest(UPDATE_HOTEL_REQUEST, updateHotelsRequestSaga),
        takeLatest(GET_ASSIGNABLE_MANAGER, getAssignableManagerSaga)
    ]);
}
