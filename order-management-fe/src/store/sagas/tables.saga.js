import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/tables.service';
import {
    getActiveOrderRequest,
    getCompletedOrdersRequest,
    getTablesRequest,
    getTablesSuccess,
    setOrderSelectedTable,
    setTableModalData
} from '../slice';
import { ADD_TABLE_REQUEST, GET_TABLE_REQUEST, REMOVE_TABLE_REQUEST } from '../types';

function* getTablesRequestSaga(action) {
    try {
        const { hotelId, filter, location, active } = action.payload;
        const res = yield service.fetch(hotelId, filter, active);

        const data = res.rows?.reduce((cur, next) => {
            cur.push({ label: `Table-${next.tableNumber}`, value: next.id });
            return cur;
        }, []);

        yield put(getTablesSuccess({ data, count: res.count, totalCount: res.totalCount }));
        if (location === 'orders') {
            if (active) {
                yield put(setOrderSelectedTable(data.length ? data[0] : {}));
                yield put(getActiveOrderRequest(data.length ? data[0].value : ''));
            } else {
                yield put(getCompletedOrdersRequest(hotelId));
            }
        }
    } catch (error) {
        console.error('Failed to fetch tables ', error);
        toast.error(`Failed to fetch tables ${error.message}`);
    }
}

function* addTablesRequestSaga(action) {
    try {
        const { hotelId, count } = action.payload;
        yield service.add(hotelId, { count });
        toast.success('Tables added successfully');

        yield put(setTableModalData(false));
        yield put(getTablesRequest({ hotelId }));
    } catch (error) {
        console.error('Failed to add tables ', error);
        yield put(setTableModalData(false));
        toast.error(`Failed to add tables ${error.message}`);
    }
}

function* removeTablesRequestSaga(action) {
    try {
        const { hotelId, count } = action.payload;
        yield service.remove(hotelId, { count });
        toast.success('Tables removed successfully');

        yield put(setTableModalData(false));
        yield put(getTablesRequest({ hotelId }));
    } catch (error) {
        console.error('Failed to remove tables ', error);
        yield put(setTableModalData(false));
        toast.error(`Failed to remove tables ${error.message}`);
    }
}

export default function* tablesSaga() {
    yield all([takeLatest(GET_TABLE_REQUEST, getTablesRequestSaga)]);
    yield all([takeLatest(ADD_TABLE_REQUEST, addTablesRequestSaga)]);
    yield all([takeLatest(REMOVE_TABLE_REQUEST, removeTablesRequestSaga)]);
}
