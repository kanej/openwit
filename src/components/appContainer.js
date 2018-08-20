import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import HomePage from './homePage'
import FeedPage from './feedPage'
import SettingsPage from './settingsPage'

import '../App.css'

import { loadingAppStates, fetchFeed, postToFeed, transferOwnership, destroyFeed } from '../actions'
import AppLoadingPanel from './appLoadingPanel'

class AppLoadingProcess extends Component {
  render () {
    const { loadingStatus, loadingErrorMessage } = this.props

    if (loadingStatus !== loadingAppStates.LOADED) {
      return (
        <AppLoadingPanel
          loadingStatus={loadingStatus}
          loadingErrorMessage={loadingErrorMessage} />
      )
    }

    return this._renderMainApp()
  }

  _renderMainApp () {
    const {
      feed,
      postToFeed,
      isOwner,
      loadOpenWitFeed,
      addPostToOpenWitFeed,
      transferOwnership,
      destroy } = this.props

    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' render={(routeProps) =>
              <HomePage {...routeProps} />
            } />
            <Route path='/feed/:contractAddress/settings' render={(routeProps) =>
              <SettingsPage
                {... routeProps}
                {... feed}
                isOwner={isOwner}
                onOwnershipTransfer={transferOwnership}
                loadOpenWitFeed={loadOpenWitFeed}
                onDestroy={destroy} />
            } />
            <Route path='/feed/:contractAddress' render={(routeProps) =>
              <FeedPage
                {... routeProps}
                {... feed}
                postToFeed={postToFeed}
                isOwner={isOwner}
                loadOpenWitFeed={loadOpenWitFeed}
                onPostAdded={addPostToOpenWitFeed} />
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

AppLoadingProcess.propTypes = {
  loadingStatus: PropTypes.string,
  currentWeb3Account: PropTypes.string
}

const mapStateToProps = state => {
  const isOwner = state.currentWeb3Account &&
    state.feed.owner === state.currentWeb3Account.toLowerCase()

  return {
    loadingStatus: state.loadingStatus,
    loadingErrorMessage: state.loadingErrorMessage,
    currentWeb3Account: state.currentWeb3Account,
    feed: state.feed,
    isOwner: isOwner,
    postToFeed: state.postToFeed
  }
}

// More this down, not needed
const mapDispatchToProps = dispatch => {
  return {
    loadOpenWitFeed: contractAddress => {
      dispatch(fetchFeed(contractAddress))
    },
    addPostToOpenWitFeed: postText => {
      dispatch(postToFeed(postText))
    },
    transferOwnership: accountAddress => {
      dispatch(transferOwnership(accountAddress))
    },
    destroy: () => {
      dispatch(destroyFeed())
    }
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppLoadingProcess)

export default AppContainer
