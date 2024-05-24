import { createSlice } from '@reduxjs/toolkit';

const managerSlice = createSlice({
    name: 'MANAGER',
    initialState: {
        updateManagerModal: false,
        selectedRow: {},
        isRemoveManager: false,
        data: {},
        formInfo: false,
        managerOptions: {
            name: { name: 'name', type: 'text', label: 'Manager Name', className: 'col-6', disabled: true },
            phoneNumber: {
                name: 'phoneNumber',
                type: 'number',
                label: 'Phone Number',
                className: 'col-6',
                disabled: true
            },
            email: { name: 'email', type: 'text', label: 'Email', className: 'col-6', disabled: true },
            hotelName: { name: 'hotelName', type: 'select', label: 'Hotel Name', className: 'col-6', options: [] },
            address: { name: 'address', type: 'text', label: 'Address', className: 'col-6', disabled: false }
        }
    },
    reducers: {
        setUpdateManagerModal: (state) => {
            state.updateManagerModal = !state.updateManagerModal;
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload;
        },
        setIsRemoveManager: (state) => {
            state.isRemoveManager = !state.isRemoveManager;
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
            state.managerOptions.hotelName.options = action.payload;
        }
    }
});

export const {
    setUpdateManagerModal,
    setSelectedRow,
    setIsRemoveManager,
    getManagersRequest,
    getManagerSuccess,
    setFormInfo,
    updateManagerRequest,
    removeManagerRequest,
    setHotelOption
} = managerSlice.actions;

export const managerReducer = managerSlice.reducer;
