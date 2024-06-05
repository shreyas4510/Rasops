import { createSlice } from '@reduxjs/toolkit';
import { MANAGER } from '../types';

const fieldClass = 'col-6 my-2';
const managerSlice = createSlice({
    name: MANAGER,
    initialState: {
        selectedRow: false,
        isRemoveManager: false,
        data: {},
        formInfo: false,
        managerOptions: {
            name: {
                name: 'name',
                type: 'text',
                label: 'Manager Name',
                className: fieldClass,
                disabled: true
            },
            phoneNumber: {
                name: 'phoneNumber',
                type: 'number',
                label: 'Phone Number',
                className: fieldClass,
                disabled: true
            },
            email: {
                name: 'email',
                type: 'text',
                label: 'Email',
                className: fieldClass,
                disabled: true
            },
            onboarded: {
                name: 'onboarded',
                type: 'text',
                label: 'Onboarded',
                className: fieldClass,
                disabled: true
            },
            hotel: {
                name: 'hotel',
                type: 'select',
                label: 'Hotel Name',
                className: 'col my-2',
                isMulti: false,
                options: []
            }
        }
    },
    reducers: {
        setSelectedRow(state, action) {
            state.selectedRow = action.payload;
        },
        getManagersRequest() {},
        getManagerSuccess(state, action) {
            state.data = action.payload;
        },
        setFormInfo(state, action) {
            state.formInfo = action.payload;
        },
        updateManagerRequest() {},
        removeManagerRequest() {},
        setHotelOption(state, action) {
            state.managerOptions.hotel.options = action.payload;
        }
    }
});

export const {
    setSelectedRow,
    getManagersRequest,
    getManagerSuccess,
    setFormInfo,
    updateManagerRequest,
    removeManagerRequest,
    setHotelOption
} = managerSlice.actions;

export const managerReducer = managerSlice.reducer;
