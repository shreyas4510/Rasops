import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/orderPlacement.service';
import { getMenuDetailsSuccess, getTableDetailsRequest, getTableDetailsSuccess } from '../slice';
import { GET_MENU_DETAIL_REQUEST, GET_TABLE_DETAILS_REQUEST, REGISTER_CUSTOMER_REQUEST } from '../types';

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
        const res = yield service.getMenuDetails(action.payload);
        yield put(getMenuDetailsSuccess(res));
    } catch (error) {
        toast.error('Failed to fetch menu card details', error.message);
    }
}

export default function* orderPlacementSaga() {
    yield all([takeLatest(GET_TABLE_DETAILS_REQUEST, getTablesDetailsRequestSaga)]);
    yield all([takeLatest(REGISTER_CUSTOMER_REQUEST, registerCustomerRequestSaga)]);
    yield all([takeLatest(GET_MENU_DETAIL_REQUEST, getMenuDetailsRequestSaga)]);
}
