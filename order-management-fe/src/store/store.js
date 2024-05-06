import createReducerManager from './reducers/index'
import createSagaMiddleware from 'redux-saga'
import createSagaManager from './sagas/index'
import { configureStore } from '@reduxjs/toolkit'


const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]
const initialState = {}
const reducerManager = createReducerManager(initialState)

const store = configureStore({
    reducer: reducerManager.reduce,
    middleware: middleware,
    preloadedState: initialState
})

let sagaManager = createSagaManager(sagaMiddleware)

sagaManager.setAddSagaListener(saga => {
    sagaMiddleware.run(saga)
})

store.reducerManager = reducerManager
store.sagaManager = sagaManager

export default store