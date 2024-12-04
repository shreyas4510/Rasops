import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/checkout.service';
import { setConfirmation, setSubscriptionData } from '../slice';
import { CANCEL_SUBSCRIPTION_REQUEST, SUBSCRIPTION_REQUEST, SUBSCRIPTION_SUCCESS_REQUEST } from '../types';

function* subscriptionRequestSaga(action) {
    try {
        const { navigate, ...payload } = action.payload;
        const res = yield service.subscribe(payload);
        yield put(setConfirmation(false));

        if (payload.plan === 'CUSTOM') {
            toast.success(res.message);
            navigate('/hotels');
            return;
        }
        yield put(setSubscriptionData(res));
    } catch (error) {
        toast.error(`Failed to subcribe hotels ${error.message}`);
    }
}

function* subscriptionSuccessRequestSaga(action) {
    try {
        const { subscriptionId, paymentId } = action.payload;
        const navigate = action.payload.navigate;

        yield service.subscriptionSuccess({
            subscriptionId,
            paymentId
        });
        yield put(setSubscriptionData(false));
        toast.success('Subscribed successfully! Enjoy the services!');
        navigate('/hotels');
    } catch (error) {
        console.error(`Failed to update subscription success ${error.message}`);
    }
}

function* cancelSubscriptionRequestSaga(action) {
    const navigate = action.payload.navigate;
    try {
        const { subscriptionId } = action.payload;
        yield service.cancelSubscription({
            subscriptionId,
            cancelImmediately: true
        });
        toast.success('Subscription cancelled successfully!');
    } catch (error) {
        console.error(`Failed to cancel subscription ${error.message}`);
        toast.error('Failed to cancel subscription! Please try again');
    }
    navigate('/hotels');
}

export default function* checkoutSaga() {
    yield all([
        takeLatest(SUBSCRIPTION_REQUEST, subscriptionRequestSaga),
        takeLatest(SUBSCRIPTION_SUCCESS_REQUEST, subscriptionSuccessRequestSaga),
        takeLatest(CANCEL_SUBSCRIPTION_REQUEST, cancelSubscriptionRequestSaga)
    ]);
}
