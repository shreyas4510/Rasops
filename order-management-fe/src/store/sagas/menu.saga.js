import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/menu.service';
import {
    getCategoryRequest,
    getCategorySucess,
    getMenuItemsRequest,
    getMenuItemsSuccess,
    setMenuModalData
} from '../slice';
import {
    CREATE_CATEGORY_REQUEST,
    CREATE_MENU_ITEM_REQUEST,
    GET_CATEGORY_REQUEST,
    GET_MENU_ITEMS_REQUEST,
    REMOVE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_REQUEST
} from '../types/menu';

function* getCategoryRequestSaga(action) {
    try {
        const hotelId = action.payload;
        const res = yield service.getCategories(hotelId);
        yield put(getCategorySucess(res));
        if (res.rows.length) {
            yield put(getMenuItemsRequest({ categoryId: res.rows[0].id }));
        }
    } catch (error) {
        console.error('Failed to fetch categories ', error);
        toast.error('Failed to fetch categories', error.message);
    }
}

function* createCategoryRequestSaga(action) {
    try {
        const payload = action.payload;

        yield service.createCategories(payload);
        toast.success('Category added successfully');

        yield put(setMenuModalData(false));
        yield put(getCategoryRequest(payload.hotelId));
    } catch (error) {
        toast.error('Failed to create category', error.message);
        yield put(setMenuModalData(false));
    }
}

function* updateCategoryRequestSaga(action) {
    try {
        const { categoryId, data, hotelId } = action.payload;

        yield service.updateCategory(categoryId, data);
        toast.success('Category details updated successfully');

        yield put(setMenuModalData(false));
        yield put(getCategoryRequest(hotelId));
    } catch (error) {
        toast.error('Failed to update category', error.message);
        yield put(setMenuModalData(false));
    }
}

function* removeCategoryRequestSaga(action) {
    try {
        const { categoryIds, hotelId } = action.payload;

        yield service.removeCategories({ categoryIds });
        toast.success('Categories removed successfully');

        yield put(setMenuModalData(false));
        yield put(getCategoryRequest(hotelId));
    } catch (error) {
        toast.error('Failed to remove categories', error.message);
        yield put(setMenuModalData(false));
    }
}

function* getMenuItemsRequestSaga(action) {
    try {
        const res = yield service.fetchMenuItems(action.payload);
        yield put(getMenuItemsSuccess(res));
    } catch (error) {
        toast.error('Failed to fetch menu items', error.message);
    }
}

function* createMenuItemRequestSaga(action) {
    try {
        const payload = action.payload;
        yield service.saveMenuItems(payload);
        toast.success('Menu items create successfully');

        yield put(setMenuModalData(false));
        yield put(getMenuItemsRequest({ categoryId: payload.categoryId }));
    } catch (error) {
        toast.error('Failed to store menu items', error.message);
        yield put(setMenuModalData(false));
    }
}

export default function* menuSaga() {
    yield all([takeLatest(GET_CATEGORY_REQUEST, getCategoryRequestSaga)]);
    yield all([takeLatest(CREATE_CATEGORY_REQUEST, createCategoryRequestSaga)]);
    yield all([takeLatest(UPDATE_CATEGORY_REQUEST, updateCategoryRequestSaga)]);
    yield all([takeLatest(REMOVE_CATEGORY_REQUEST, removeCategoryRequestSaga)]);
    yield all([takeLatest(GET_MENU_ITEMS_REQUEST, getMenuItemsRequestSaga)]);
    yield all([takeLatest(CREATE_MENU_ITEM_REQUEST, createMenuItemRequestSaga)]);
}
