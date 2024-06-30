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
    checkoutReducer,
    ordersReducer,
    dashboardReducer
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
    checkout: checkoutReducer,
    orders: ordersReducer,
    dashboard: dashboardReducer
};

export default rootReducers;
