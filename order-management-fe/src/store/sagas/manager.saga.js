import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/manager.service';
import { getManagerSuccess } from '../slice';
import { GET_MANAGERS_REQUEST } from '../types';

function* getManagerRequestSaga(action) {
    try {
        const ownerId = action.payload;
        const res = yield service.getManagers(ownerId);
        yield put(getManagerSuccess(res));
    } catch (error) {
        console.error(`Failed to login: ${error?.message}`);
    }
}

export default function* managerSaga() {
    yield all([takeLatest(GET_MANAGERS_REQUEST, getManagerRequestSaga)]);
}
