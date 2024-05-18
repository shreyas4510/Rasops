import { authReducer, hotelReducer, inviteReducer, loaderReducer, managerReducer } from '../slice';

const rootReducers = {
    loader: loaderReducer,
    users: authReducer,
    invite: inviteReducer,
    hotel: hotelReducer,
    managers: managerReducer
};

export default rootReducers;
