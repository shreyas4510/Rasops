import { all, fork } from 'redux-saga/effects';
import authSaga from './auth.saga';
import checkoutSaga from './checkout.saga';
import hotelSaga from './hotel.saga';
import inviteSaga from './invite.saga';
import managerSaga from './manager.saga';
import menuSaga from './menu.saga';
import orderPlacementSaga from './orderPlacement.saga';
import paymentActivationSaga from './paymentActivation.saga';
import tablesSaga from './tables.saga';

export default function* () {
    yield all([
        fork(authSaga),
        fork(managerSaga),
        fork(hotelSaga),
        fork(inviteSaga),
        fork(menuSaga),
        fork(tablesSaga),
        fork(orderPlacementSaga),
        fork(paymentActivationSaga),
        fork(checkoutSaga)
    ]);
}
