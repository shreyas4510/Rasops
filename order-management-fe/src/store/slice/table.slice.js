import { createSlice } from '@reduxjs/toolkit';
import { TABLES } from '../types';

const tablesSlice = createSlice({
    name: TABLES,
    reducers: {
        getTablesRequest() { },
        getTablesSuccess( state, action ) {
            const { data, count } = action.payload;
            state.tablesData = data;
            state.tablesCounts = count;
            if (count) {
                state.selectedTable = data[0];
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
        selectedTable: {},
        tablesCounts: 0
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
