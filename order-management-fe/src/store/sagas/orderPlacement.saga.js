import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import env from '../../config/env';
import * as checkoutService from '../../services/checkout.service';
import * as orderService from '../../services/order.service';
import * as service from '../../services/orderPlacement.service';
import {
    getMenuDetailsRequest,
    getMenuDetailsSuccess,
    getTableDetailsRequest,
    getTableDetailsSuccess,
    getTablesRequest,
    setFeedback,
    setFeedbackDetails,
    setOrderDetails,
    setOrderPaymentData,
    setPaymentRequest,
    setViewOrderDetails
} from '../slice';
import {
    GET_MENU_DETAIL_REQUEST,
    GET_ORDER_DETAILS_REQUEST,
    GET_TABLE_DETAILS_REQUEST,
    PAY_CONFIRMATION_REQUEST,
    PAY_MANUAL_REQUEST,
    PLACE_ORDER_REQUEST,
    REGISTER_CUSTOMER_REQUEST,
    SEND_FEEDBACK_REQUEST
} from '../types';

function* getTablesDetailsRequestSaga(action) {
    try {
        const id = action.payload;
        const res = yield service.getTableDetail(id);

        yield put(getTableDetailsSuccess(res));
    } catch (error) {
        console.error('Failed to get table by id ', error);
        toast.error(`Failed to get table details ${error.message}`);
    }
}

function* registerCustomerRequestSaga(action) {
    try {
        const payload = action.payload;
        const registration = yield navigator.serviceWorker.register('/serviceWorker.js');
        yield navigator.serviceWorker.ready;

        const subscription = yield registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: env.notificationKey
        });
        payload.subscription = subscription;
        yield service.registerCustomer(payload);
        yield put(getTableDetailsRequest(payload.tableId));
    } catch (error) {
        console.error('Failed to register user', error);
        toast.error(`Failed to register customer ${error.message}`);
    }
}

function* getMenuDetailsRequestSaga(action) {
    try {
        const { hotelId, customerId } = action.payload;
        const res = yield service.getMenuDetails(hotelId, customerId);
        yield put(getMenuDetailsSuccess(res));
    } catch (error) {
        console.error('Failed to fetch menu card details', error);
        toast.error(`Failed to fetch menu card details ${error.message}`);
    }
}

function* placeOrderRequestSaga(action) {
    try {
        const payload = action.payload;
        yield service.placeOrder(payload);
        yield put(setOrderDetails({}));
        yield put(setViewOrderDetails({}));
        yield put(getMenuDetailsRequest({ hotelId: payload.hotelId, customerId: payload.customerId }));
        toast.success('Order received! Your delicious meal is on the way. Thank you for your patience!');
    } catch (error) {
        console.error('Failed to place order', error);
        toast.error(`Failed to fetch menu card details ${error.message}`);
    }
}

function* getOrderDetailsRequestSaga(action) {
    try {
        const customerId = action.payload;
        const res = yield service.getOrder(customerId);
        if (!res.count) {
            toast.warn(`Looks like you haven't ordered anything yet. Explore our menu and treat yourself.`);
        } else {
            yield put(setViewOrderDetails(res));
        }
    } catch (error) {
        console.error('Failed to fetch order details', error);
        toast.error(`Failed to fetch order details ${error.message}`);
    }
}

function* paymentOrderRequestSaga(action) {
    try {
        const payload = action.payload;
        const res = yield checkoutService.paymentRequest(payload);
        if (payload.manual) {
            toast.info(`Please pay manually and wait until your request is approved`);
        } else {
            yield put(setOrderPaymentData(res));
        }
    } catch (error) {
        console.error('Failed to process payment request', error);
        toast.error(`Failed to process payment request ${error.message}`);
    }
}

function* paymentConfirmationRequestSaga(action) {
    try {
        const { hotelId, ...payload } = action.payload;
        yield checkoutService.paymentConfirmation(payload);
        if (!payload.manual) {
            toast.info(`🥂 Payment confirmed, thank you for choosing us! 🌟 Your feedback means the world to us.`);
            yield put(setViewOrderDetails({}));
            yield put(setFeedback(true));
        } else {
            toast.success(`Payment confirmed successfully`);
            yield put(setPaymentRequest(false));
            yield put(getTablesRequest({ hotelId, location: 'orders', active: true }));
        }
    } catch (error) {
        console.error('Failed to process payment request', error);
        toast.error(`Failed to confirm payment ${error.message}`);
    }
}

function* sendFeedbackRequestSaga(action) {
    try {
        const payload = action.payload;
        yield orderService.feedback(payload);
        toast.success(`Thank you for your feedback! We appreciate your time and input.`);
        yield put(setFeedbackDetails({}));
    } catch (error) {
        console.error('Failed to process feedback request', error);
        toast.error(`Failed to submit feedback ${error.message}`);
    }
}

export default function* orderPlacementSaga() {
    yield all([takeLatest(GET_TABLE_DETAILS_REQUEST, getTablesDetailsRequestSaga)]);
    yield all([takeLatest(REGISTER_CUSTOMER_REQUEST, registerCustomerRequestSaga)]);
    yield all([takeLatest(GET_MENU_DETAIL_REQUEST, getMenuDetailsRequestSaga)]);
    yield all([takeLatest(PLACE_ORDER_REQUEST, placeOrderRequestSaga)]);
    yield all([takeLatest(GET_ORDER_DETAILS_REQUEST, getOrderDetailsRequestSaga)]);
    yield all([takeLatest(PAY_MANUAL_REQUEST, paymentOrderRequestSaga)]);
    yield all([takeLatest(PAY_CONFIRMATION_REQUEST, paymentConfirmationRequestSaga)]);
    yield all([takeLatest(SEND_FEEDBACK_REQUEST, sendFeedbackRequestSaga)]);
}
