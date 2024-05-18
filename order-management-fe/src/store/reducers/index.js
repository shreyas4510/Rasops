import { authReducer, hotelReducer, inviteReducer, loaderReducer, managerReducer } from '../slice';

const rootReducers = {
    loader: loaderReducer,
    user: authReducer,
    invite: inviteReducer,
    manager: managerReducer,
    hotel: hotelReducer
};

export default rootReducers;
