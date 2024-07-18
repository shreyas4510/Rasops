import { createSlice } from '@reduxjs/toolkit';
import { FIELD_CLASS } from '../../utils/constants';
import { MANAGER } from '../types';

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
                className: FIELD_CLASS,
                disabled: true
            },
            phoneNumber: {
                name: 'phoneNumber',
                type: 'number',
                label: 'Phone Number',
                className: FIELD_CLASS,
                disabled: true
            },
            email: {
                name: 'email',
                type: 'text',
                label: 'Email',
                className: FIELD_CLASS,
                disabled: true
            },
            onboarded: {
                name: 'onboarded',
                type: 'text',
                label: 'Onboarded',
                className: FIELD_CLASS,
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
