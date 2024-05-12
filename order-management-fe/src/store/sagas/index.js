import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';

const rootSaga = function* () {
    yield all([fork(authSaga)]);
};

export default rootSaga;
