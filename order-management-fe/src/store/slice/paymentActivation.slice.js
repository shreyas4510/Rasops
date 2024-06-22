import { createSlice } from '@reduxjs/toolkit';
import { PAYMENT_ACTIVATION } from '../types';

const paymentActivationSlice = createSlice({
    name: PAYMENT_ACTIVATION,
    reducers: {
        setCurrentStep(state, action) {
            state.currentStep = action.payload;
        },
        setPaymentActivate(state, action) {
            state.activate = action.payload;
        },
        saveBusinessDetailsRequest() {},
        saveStakeholderDetailsRequest() {},
        saveBankDetailsRequest() {}
    },
    initialState: {
        businessDetailInitialValues: {
            email: '',
            phone: '',
            legalBusinessName: '',
            businessType: '',
            profile: {
                category: '',
                subcategory: '',
                addresses: {
                    registered: {
                        street1: '',
                        street2: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: ''
                    }
                }
            },
            legalInfo: {
                pan: '',
                gst: ''
            }
        },
        stakeholderDetailsInitialValues: {
            name: '',
            email: '',
            kyc: {
                pan: ''
            },
            addresses: {
                residential: {
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: ''
                }
            }
        },
        bankDetailsInitialValues: {
            accountNumber: '',
            ifscCode: '',
            beneficiaryName: ''
        },
        currentStep: 1,
        activate: false
    }
});
export const {
    setCurrentStep,
    setPaymentActivate,
    saveBusinessDetailsRequest,
    saveStakeholderDetailsRequest,
    saveBankDetailsRequest
} = paymentActivationSlice.actions;

export const paymentActivationReducer = paymentActivationSlice.reducer;
