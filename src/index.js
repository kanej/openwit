import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'

// import registerServiceWorker from './registerServiceWorker'

import store from './store'

import { initializeApp } from './actions'
import { Provider } from 'react-redux'
import AppContainer from './components/appContainer'

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'))

// setup()

store.dispatch(initializeApp())
  .then(() => {
    console.info('OpenWit App Initialized')
  })
