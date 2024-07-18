import { createSlice } from '@reduxjs/toolkit';
import { FIELD_CLASS } from '../../utils/constants';
import { HOTEL } from '../types';

const hotelSlice = createSlice({
    name: HOTEL,
    initialState: {
        data: {},
        hotelOptions: {
            hotelName: { name: 'name', type: 'text', label: 'Hotel Name', className: FIELD_CLASS },
            address: { name: 'address', type: 'text', label: 'Address', className: FIELD_CLASS },
            careNumber: { name: 'careNumber', type: 'text', label: 'Customer Care Number', className: FIELD_CLASS },
            manager: { name: 'manager', type: 'select', label: 'Manager', className: FIELD_CLASS, options: [] },
            openTime: { name: 'openTime', type: 'time', label: 'Open Time', className: FIELD_CLASS },
            closeTime: { name: 'closeTime', type: 'time', label: 'Close Time', className: FIELD_CLASS }
        },
        deleteHotelConfirm: false,
        formData: false,
        globalHotelId: null,
        hotelDetails: {}
    },
    reducers: {
        setHotelOptions(state, action) {
            state.hotelOptions = action.payload;
        },
        createHotelRequest() {},
        getHotelRequest() {},
        getHotelSuccess(state, action) {
            state.data = action.payload;
        },
        updateHotelRequest() {},
        removeHotelRequest() {},
        removeHotelSuccess(state, action) {
            state.deleteHotelConfirm = false;
            const index = state.data.rows.findIndex((item) => item.id === action.payload);
            state.data.rows.splice(index, 1);
        },
        setDeleteHotelConfirm(state, action) {
            state.deleteHotelConfirm = action.payload;
        },
        setHotelFormData(state, action) {
            state.formData = action.payload;
        },
        getAssignableManagerRequest() {},
        setAssignableManagers(state, action) {
            const selectedMangers = state?.formData?.initialValues?.manager || [];
            state.hotelOptions.manager.options = [...selectedMangers, ...action.payload];
        },
        setGlobalHotelId(state, action) {
            state.globalHotelId = action.payload;
        }
    }
});

export const {
    setHotelOptions,
    createHotelRequest,
    getHotelRequest,
    getHotelSuccess,
    removeHotelRequest,
    removeHotelSuccess,
    updateHotelRequest,
    updateHotelSuccess,
    setDeleteHotelConfirm,
    setHotelFormData,
    getHotelManagersRequest,
    getHotelManagersSuccess,
    getAssignableManagerRequest,
    setAssignableManagers,
    setGlobalHotelId
} = hotelSlice.actions;

export const hotelReducer = hotelSlice.reducer;
