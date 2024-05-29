import { all, takeLatest } from 'redux-saga/effects';
import { GET_CATEGORY_REQUEST } from '../types/menu';

function* getCategoryRequestSaga() {
    try {
        console.log('get category saga');
    } catch (error) {
        console.error(`Failed to login: ${error?.message}`);
    }
}

export default function* managerSaga() {
    yield all([takeLatest(GET_CATEGORY_REQUEST, getCategoryRequestSaga)]);
}
