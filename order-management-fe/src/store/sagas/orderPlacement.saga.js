import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/orderPlacement.service';
import { getTableDetailsRequest, getTableDetailsSuccess } from '../slice';
import { GET_TABLE_DETAILS_REQUEST, REGISTER_CUSTOMER_REQUEST } from '../types';

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

export default function* orderPlacementSaga() {
    yield all([takeLatest(GET_TABLE_DETAILS_REQUEST, getTablesDetailsRequestSaga)]);
    yield all([takeLatest(REGISTER_CUSTOMER_REQUEST, registerCustomerRequestSaga)]);
}
