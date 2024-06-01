import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';
import hotelSaga from './hotel.saga';
import inviteSaga from './invite.saga';
import managerSaga from './manager.saga';
import menuSaga from './menu.saga';

export default function* () {
    yield all([fork(authSaga), fork(managerSaga), fork(hotelSaga), fork(inviteSaga), fork(menuSaga)]);
}
