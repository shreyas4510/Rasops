import {
    authReducer,
    hotelReducer,
    inviteReducer,
    appReducer,
    managerReducer,
    menuReducer,
    orderPlacementReducer,
    tablesReducer,
    paymentActivationReducer,
    checkoutReducer
} from '../slice';

const rootReducers = {
    app: appReducer,
    user: authReducer,
    invite: inviteReducer,
    manager: managerReducer,
    hotel: hotelReducer,
    menu: menuReducer,
    table: tablesReducer,
    orderPlacement: orderPlacementReducer,
    paymentActivation: paymentActivationReducer,
    checkout: checkoutReducer
};

export default rootReducers;
