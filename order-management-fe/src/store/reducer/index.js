import { authReducer, hotelReducer, managerReducer } from '../slice';

const rootReducers = {
    user: authReducer,
    managers: managerReducer,
    hotels: hotelReducer
};

export default rootReducers;
