import {
    authReducer,
    hotelReducer,
    inviteReducer,
    appReducer,
    managerReducer,
    menuReducer,
    orderPlacementReducer,
    tablesReducer
} from '../slice';

const rootReducers = {
    app: appReducer,
    user: authReducer,
    invite: inviteReducer,
    manager: managerReducer,
    hotel: hotelReducer,
    menu: menuReducer,
    table: tablesReducer,
    orderPlacement: orderPlacementReducer
};

export default rootReducers;
