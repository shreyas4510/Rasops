import { authReducer, hotelReducer, inviteReducer, loaderReducer, managerReducer, menuReducer } from '../slice';

const rootReducers = {
    loader: loaderReducer,
    user: authReducer,
    invite: inviteReducer,
    manager: managerReducer,
    hotel: hotelReducer,
    menu: menuReducer
};

export default rootReducers;
