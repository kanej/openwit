import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware, compose } from 'redux'
import openWitApp from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  openWitApp,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware
    )))

window.store = store

export default store
