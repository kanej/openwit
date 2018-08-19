import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import FeedPage from './components/feedPage'
import HomePage from './components/homePage'

import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      accounts: props.accounts,
      getOpenWitFeed: props.getOpenWitFeed,
      addPostToOpenWitFeed: props.addPostToOpenWitFeed,
      transferOwnership: props.transferOwnership,
      feed: null,
      owner: null,
      contract: null
    }
  }

  render () {
    const {
      accounts,
      getOpenWitFeed,
      addPostToOpenWitFeed,
      transferOwnership } = this.state

    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' render={(routeProps) =>
              <HomePage
                {...routeProps} />
            } />
            <Route path='/feed/:contractAddress' render={(routeProps) =>
              <FeedPage
                {...routeProps}
                accounts={accounts}
                getOpenWitFeed={getOpenWitFeed}
                addPostToOpenWitFeed={addPostToOpenWitFeed}
                onOwnershipTransfer={transferOwnership} />
            } />
            <Route>
              <div>
                <h1>Not Found</h1>
                <p>It seems the distributed web has got a little too distributed ... it is not here</p>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

App.propTypes = {
  accounts: PropTypes.array.isRequired,
  getOpenWitFeed: PropTypes.func.isRequired,
  addPostToOpenWitFeed: PropTypes.func.isRequired
}

export default App
