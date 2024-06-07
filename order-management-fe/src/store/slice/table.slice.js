import { createSlice } from '@reduxjs/toolkit';
import { TABLES } from '../types';

const tablesSlice = createSlice({
    name: TABLES,
    reducers: {
        getTablesRequest() {},
        getTablesSuccess(state, action) {
            const { data, count } = action.payload;
            state.tablesData = data;
            state.tablesCounts = count;
            state.selectedTable = data[0] || {};
        },
        setSelectedTable(state, action) {
            state.selectedTable = action.payload;
        },
        setTableModalData(state, action) {
            state.tablesModalData = action.payload;
        },
        addTablesRequest() {},
        removeTablesRequest() {},
        setTableUrl(state, action) {
            state.tableUrl = action.payload;
        }
    },
    initialState: {
        tablesData: [],
        tablesModalData: false,
        selectedTable: {},
        tablesCounts: 0,
        tableUrl: ''
    }
});
export const {
    getTablesRequest,
    getTablesSuccess,
    setSelectedTable,
    setTableModalData,
    addTablesRequest,
    removeTablesRequest,
    setTableUrl
} = tablesSlice.actions;

export const tablesReducer = tablesSlice.reducer;
