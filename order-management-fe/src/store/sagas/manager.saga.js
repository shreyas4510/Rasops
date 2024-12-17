import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/manager.service';
import { getManagerSuccess, getManagersRequest, setFormInfo, setSelectedRow } from '../slice';
import { GET_MANAGERS_REQUEST, REMOVE_MANAGER_REQUEST, UPDATE_MANAGER_REQUEST } from '../types';

function* getManagerRequestSaga(action) {
    try {
        const res = yield service.getManagers(action.payload || {});
        yield put(getManagerSuccess(res));
    } catch (error) {
        console.error(`Failed to login: ${error?.message}`);
    }
}
function* updateManagerRequestSaga(action) {
    try {
        const { id, data } = action.payload;
        yield service.updateManager({ id, data });
        toast.success('Manager details updated successfully');
        yield put(getManagersRequest());
        yield put(setFormInfo(false));
    } catch (error) {
        toast.error(`Failed to update manager ${error.message}`);
        yield put(setFormInfo(false));
    }
}
function* removeManagerRequestSaga(action) {
    try {
        const { id } = action.payload;
        const res = yield service.removeManager(id);
        toast.success(res.message);
        yield put(setSelectedRow(false));
        yield put(getManagersRequest());
    } catch (error) {
        toast.error(`Failed to remove manager ${error.message}`);
        yield put(setSelectedRow(false));
    }
}

export default function* managerSaga() {
    yield all([takeLatest(GET_MANAGERS_REQUEST, getManagerRequestSaga)]);
    yield all([takeLatest(UPDATE_MANAGER_REQUEST, updateManagerRequestSaga)]);
    yield all([takeLatest(REMOVE_MANAGER_REQUEST, removeManagerRequestSaga)]);
}
