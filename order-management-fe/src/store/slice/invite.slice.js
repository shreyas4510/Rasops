import { createSlice } from '@reduxjs/toolkit';
import { INVITE } from '../types';

export const inviteSlice = createSlice({
    name: INVITE,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setRemoveInvite: (state) => {
            state.isRemoveInvite = !state.isRemoveInvite;
        },
        inviteUserRequest: () => {},
        inviteUserSuccess: (state) => {
            state.change = !state.change;
        },
        listInviteRequest: () => {},
        listUserSuccess: (state, action) => {
            state.inviteData = action.payload;
        },
        removeInviteRequest: () => {},
        removeUserSuccess: (state) => {
            state.change = !state.change;
            state.isRemoveInvite = false;
            state.inviteData.rows = state.inviteData.rows?.filter((row) => row?.id !== state.selectedInvite);
        },
        setSelectedInvite: (state, action) => {
            state.selectedInvite = action.payload;
        }
    },
    initialState: {
        change: false,
        email: '',
        inviteData: { count: 0, rows: [] },
        isRemoveInvite: false,
        selectedInvite: ''
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
    setSelectedInvite
} = inviteSlice.actions;

export const inviteReducer = inviteSlice.reducer;
