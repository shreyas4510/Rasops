import { createSlice } from '@reduxjs/toolkit';
import { INVITE } from '../types';

const inviteSlice = createSlice({
    name: INVITE,
    reducers: {
        setEmail(state, action) {
            state.email = action.payload;
        },
        setRemoveInvite(state) {
            state.isRemoveInvite = !state.isRemoveInvite;
        },
        inviteUserRequest() {},
        inviteUserSuccess(state) {
            state.change = !state.change;
        },
        listInviteRequest() {},
        listUserSuccess(state, action) {
            state.inviteData = action.payload;
        },
        removeInviteRequest() {},
        removeUserSuccess(state) {
            state.change = !state.change;
            state.isRemoveInvite = false;
        },
        setSelectedInvite(state, action) {
            state.selectedInvite = action.payload;
        },
        setInviteSorting(state, action) {
            state.sorting = action.payload;
        },
        setInviteFiltering(state, action) {
            state.filtering = action.payload;
        },
        setInvitePagination(state, action) {
            state.pagination = action.payload;
        }
    },
    initialState: {
        change: false,
        email: '',
        inviteData: { count: 0, rows: [] },
        isRemoveInvite: false,
        selectedInvite: '',
        sorting: [],
        filtering: {},
        pagination: {
            pageIndex: 0,
            pageSize: 10
        }
    }
});
export const {
    setEmail,
    inviteUserRequest,
    inviteUserSuccess,
    listInviteRequest,
    listUserSuccess,
    removeInviteRequest,
    removeUserSuccess,
    setRemoveInvite,
    setSelectedInvite,
    setInviteSorting,
    setInviteFiltering,
    setInvitePagination
} = inviteSlice.actions;

export const inviteReducer = inviteSlice.reducer;
