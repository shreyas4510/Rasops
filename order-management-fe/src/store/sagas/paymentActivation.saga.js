import { toast } from 'react-toastify';
import { all, put, takeLatest } from 'redux-saga/effects';
import * as service from '../../services/checkout.service';
import { getUserRequest, setCurrentStep, setPaymentActivate } from '../slice';
import { SAVE_BANK_DETAILS_REQUEST, SAVE_BUSINESS_DETAILS_REQUEST, SAVE_STAKEHOLDER_DETAILS_REQUEST } from '../types';

function* saveBusinessDetailsSaga(action) {
    try {
        const { step, payload } = action.payload;
        yield service.saveBusinessDetails(payload);
        toast.success('Business details saved successfully');
        yield put(setCurrentStep(step));
    } catch (error) {
        console.error('Failed to add business details', error);
        toast.error('Failed to add business details ', error.message);
    }
}

function* saveStakeholderDetailsSaga(action) {
    try {
        const { step, payload } = action.payload;
        yield service.saveStakeholderDetails(payload);
        toast.success('Stakeholder details saved successfully');
        yield put(setCurrentStep(step));
    } catch (error) {
        console.error('Failed to add stakeholder details', error);
        toast.error('Failed to add stakeholder details ', error.message);
    }
}

function* saveBankDetailsSaga(action) {
    try {
        const payload = action.payload;
        yield service.saveBankDetails(payload);

        toast.success('Account activated successfully');

        yield put(getUserRequest());
        yield put(setPaymentActivate(false));
        yield put(setCurrentStep(1));
    } catch (error) {
        console.error('Failed to activate details', error);
        toast.error('Failed to activate details ', error.message);
    }
}

export default function* paymentActivationSaga() {
    yield all([
        takeLatest(SAVE_BUSINESS_DETAILS_REQUEST, saveBusinessDetailsSaga),
        takeLatest(SAVE_STAKEHOLDER_DETAILS_REQUEST, saveStakeholderDetailsSaga),
        takeLatest(SAVE_BANK_DETAILS_REQUEST, saveBankDetailsSaga)
    ]);
}
