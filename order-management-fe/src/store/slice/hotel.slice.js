import { createSlice } from '@reduxjs/toolkit';
import { HOTEL } from '../types';

const fieldClass = 'col-md-6 col-12 my-2';
const hotelSlice = createSlice({
    name: HOTEL,
    initialState: {
        data: {},
        hotelOptions: {
            hotelName: { name: 'name', type: 'text', label: 'Hotel Name', className: fieldClass },
            address: { name: 'address', type: 'text', label: 'Address', className: fieldClass },
            careNumber: { name: 'careNumber', type: 'text', label: 'Customer Care Number', className: fieldClass },
            manager: { name: 'manager', type: 'select', label: 'Manager', className: fieldClass, options: [] },
            openTime: { name: 'openTime', type: 'time', label: 'Open Time', className: fieldClass },
            closeTime: { name: 'closeTime', type: 'time', label: 'Close Time', className: fieldClass }
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
