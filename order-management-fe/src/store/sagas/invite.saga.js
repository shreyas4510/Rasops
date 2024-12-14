import { toast } from 'react-toastify';
import { put, all, takeLatest, call } from 'redux-saga/effects';
import * as service from '../../services/invite.service';
import {
    inviteUserSuccess,
    listInviteRequest,
    listUserSuccess,
    removeUserSuccess,
    setEmail
} from '../slice/invite.slice';
import { INVITE_USER_REQUEST, LIST_USER_REQUEST, REMOVE_USER_REQUEST } from '../types';

function* inviteUserRequestSaga(action) {
    try {
        const { email, resend } = action.payload;
        const res = yield service.inviteUser({ email, resend });
        yield put(inviteUserSuccess({ data: res }));
        yield put(setEmail(''));
        toast.success(resend ? 'Invite resend successfully' : 'User invited successfully');
    } catch (error) {
        toast.error(`Failed to invite user: ${error.message}`);
    }
}

function* inviteListSaga(action) {
    try {
        const res = yield service.listUser(action.payload);
        yield put(listUserSuccess(res));
    } catch (error) {
        toast.error(`Failed to fetch invite list: ${error.message}`);
    }
}
function* removeInviteSaga(action) {
    try {
        const res = yield service.removeUser(action.payload);
        yield put(removeUserSuccess(res));
        yield put(listInviteRequest({}));
        yield call(toast.success, 'Invite record deleted successfully');
    } catch (error) {
        toast.error(`Failed to delete invite record: ${error.message}`);
    }
}
export default function* inviteSaga() {
    yield all([
        takeLatest(INVITE_USER_REQUEST, inviteUserRequestSaga),
        takeLatest(LIST_USER_REQUEST, inviteListSaga),
        takeLatest(REMOVE_USER_REQUEST, removeInviteSaga)
    ]);
}
