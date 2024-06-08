import {
    authReducer,
    hotelReducer,
    inviteReducer,
    loaderReducer,
    managerReducer,
    menuReducer,
    orderPlacementReducer,
    tablesReducer
} from '../slice';

const rootReducers = {
    loader: loaderReducer,
    user: authReducer,
    invite: inviteReducer,
    manager: managerReducer,
    hotel: hotelReducer,
    menu: menuReducer,
    table: tablesReducer,
    orderPlacement: orderPlacementReducer
};

export default rootReducers;
