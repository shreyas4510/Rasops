import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import rootSaga from "./sagas";
import rootReducers from "./reducers";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: rootReducers,
    middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);


export default store;
