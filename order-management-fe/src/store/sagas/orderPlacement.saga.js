import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/orderPlacement.service';
import { getMenuDetailsRequest, getMenuDetailsSuccess, getTableDetailsRequest, getTableDetailsSuccess, setOrderDetails, setViewOrderDetails } from '../slice';
import { GET_MENU_DETAIL_REQUEST, GET_ORDER_DETAILS_REQUEST, GET_TABLE_DETAILS_REQUEST, PLACE_ORDER_REQUEST, REGISTER_CUSTOMER_REQUEST } from '../types';

function* getTablesDetailsRequestSaga(action) {
    try {
        const id = action.payload;
        const res = yield service.getTableDetail(id);

        yield put(getTableDetailsSuccess(res));
    } catch (error) {
        console.error('Failed to get table by id ', error);
    }
}

function* registerCustomerRequestSaga(action) {
    try {
        const payload = action.payload;
        yield service.registerCustomer(payload);
        yield put(getTableDetailsRequest(payload.tableId));
    } catch (error) {
        console.error('Failed to register user', error);
        toast.error('Failed to register customer ', error.message);
    }
}

function* getMenuDetailsRequestSaga(action) {
    try {
        const { hotelId, customerId } = action.payload;
        const res = yield service.getMenuDetails(hotelId, customerId);
        yield put(getMenuDetailsSuccess(res));
    } catch (error) {
        console.error('Failed to fetch menu card details', error);
        toast.error('Failed to fetch menu card details', error.message);
    }
}

function* placeOrderRequestSaga(action) {
    try {
        const { hotelId, ...payload } = action.payload;
        yield service.placeOrder(payload);
        yield put(setOrderDetails({}));
        yield put(setViewOrderDetails({}));
        yield put(getMenuDetailsRequest({ hotelId, customerId: payload.customerId }));
        toast.success('Order received! Your delicious meal is on the way. Thank you for your patience!')
    } catch (error) {
        console.error('Failed to place order', error);
        toast.error('Failed to fetch menu card details', error.message);
    }
}

function* getOrderDetailsRequestSaga(action) {
    try {
        const customerId = action.payload;
        const res = yield service.getOrder(customerId);
        if (!res.count) {
            toast.warn(`Looks like you haven't ordered anything yet. Explore our menu and treat yourself.`);
        } else {
            yield put(setViewOrderDetails(res));
        }
    } catch (error) {
        console.error('Failed to fetch order details', error);
        toast.error('Failed to fetch order details', error.message);
    }
}

export default function* orderPlacementSaga() {
    yield all([takeLatest(GET_TABLE_DETAILS_REQUEST, getTablesDetailsRequestSaga)]);
    yield all([takeLatest(REGISTER_CUSTOMER_REQUEST, registerCustomerRequestSaga)]);
    yield all([takeLatest(GET_MENU_DETAIL_REQUEST, getMenuDetailsRequestSaga)]);
    yield all([takeLatest(PLACE_ORDER_REQUEST, placeOrderRequestSaga)]);
    yield all([takeLatest(GET_ORDER_DETAILS_REQUEST, getOrderDetailsRequestSaga)]);
}
