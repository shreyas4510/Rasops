import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';

export default function* () {
    yield all([fork(authSaga)]);
}
