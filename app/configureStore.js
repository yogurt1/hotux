import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunk from 'redux-thunk'
import {routerMiddleware} from 'react-router-redux'
import * as reducers from 'app/reducers'

export default function configureStore({
    history, initialState
} = {}) {
    const middlewares = [
        thunk,
        routerMiddleware(history)
    ]

    const enhancer = applyMiddleware(...middlewares)
    const reducer = combineReducers(reducers)
    const devTools = (BROWSER && window.devToolsExtension)
        ? window.devToolsExtension()
        : f => f

    let store = createStore(reducer, initialState, compose(
        enhancer, devTools
    ))

    if (module.hot) module.hot.accept(() => {
        const nextReducer = combineReducers(require('./reducers'))
        store.replaceReducer(nextReducer)
    })

    return store
}
