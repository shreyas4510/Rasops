import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/menu.service';
import { getCategoryRequest, setAddCategoryModalData } from '../slice';
import { CREATE_CATEGORY_REQUEST, GET_CATEGORY_REQUEST } from '../types/menu';

function* getCategoryRequestSaga() {
    try {
        console.log('get category saga');
    } catch (error) {
        console.error(`Failed to login: ${error?.message}`);
    }
}

function* createCategoryRequestSaga(action) {
    try {
        const payload = action.payload;
        if (!payload.hotelId) {
            toast.error('Hotel not detected please try re-login');
            localStorage.clear();
        }

        yield service.createCategories(payload);
        toast.success('Category added successfully');

        yield put(setAddCategoryModalData(false));
        yield put(getCategoryRequest());
    } catch (error) {
        toast.error('Failed to create category', error.message);
        yield put(setAddCategoryModalData(false));
    }
}

export default function* menuSaga() {
    yield all([takeLatest(GET_CATEGORY_REQUEST, getCategoryRequestSaga)]);
    yield all([takeLatest(CREATE_CATEGORY_REQUEST, createCategoryRequestSaga)]);
}
