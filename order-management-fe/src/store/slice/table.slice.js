import { createSlice } from '@reduxjs/toolkit';
import { TABLES } from '../types';

const tablesSlice = createSlice({
    name: TABLES,
    reducers: {
        getTablesRequest() { },
        getTablesSuccess( state, action ) {
            state.tablesData = action.payload;
            if (action.payload?.length) {
                state.selectedTable = action.payload[0];
            }
        },
        setSelectedTable(state, action) {
            state.selectedTable = action.payload;
        },
        setTableModalData(state, action) {
            state.tablesModalData = action.payload;
        },
        addTablesRequest() {},
        removeTablesRequest() {}
    },
    initialState: {
        tablesData: [],
        tablesModalData: false,
        selectedTable: {}
    }
});
export const {
    getTablesRequest,
    getTablesSuccess,
    setSelectedTable,
    setTableModalData,
    addTablesRequest,
    removeTablesRequest
} = tablesSlice.actions;

export const tablesReducer = tablesSlice.reducer;
