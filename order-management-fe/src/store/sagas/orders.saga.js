import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/order.service';
import { getActiveOrderRequest, getActiveOrderSuccess, getCompletedOrdersSuccess } from '../slice';
import { GET_ACTIVE_ORDER_REQUEST, GET_COMPLETED_ORDER_REQUEST, UPDATE_PENDING_ORDER_REQUEST } from '../types';

function* getActiveOrdersRequestSaga(action) {
    try {
        const tableId = action.payload;
        let result = yield service.getActiveOrders(tableId);
        result.description = (result.description || []).reverse();
        if ('message' in result) {
            result = {};
        }
        yield put(getActiveOrderSuccess(result));
    } catch (error) {
        console.error('Failed to get table active orders', error);
        toast.error(`Failed to get table active orders ${error.message}`);
    }
}

function* getCompletedOrdersRequestSaga(action) {
    try {
        const { hotelId, params } = action.payload;
        const result = yield service.getCompletedOrders({ hotelId, ...params });
        yield put(getCompletedOrdersSuccess(result));
    } catch (error) {
        console.error('Failed to get table completed orders', error);
        toast.error(`Failed to get table completed orders ${error.message}`);
    }
}

function* updatePendingOrdersRequestSaga(action) {
    try {
        const { orders, tableId, customerId } = action.payload;
        yield service.updatePendingOrders({ orders, customerId });
        yield put(getActiveOrderRequest(tableId));
    } catch (error) {
        console.error('Failed to update table orders', error);
        toast.error(`Failed to update table orders ${error.message}`);
    }
}

export default function* orderSaga() {
    yield all([takeLatest(GET_ACTIVE_ORDER_REQUEST, getActiveOrdersRequestSaga)]);
    yield all([takeLatest(GET_COMPLETED_ORDER_REQUEST, getCompletedOrdersRequestSaga)]);
    yield all([takeLatest(UPDATE_PENDING_ORDER_REQUEST, updatePendingOrdersRequestSaga)]);
}
