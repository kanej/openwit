import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import AppLoadingPanel from './appLoadingPanel'
import HomePage from './homePage'
import FeedPage from './feedPage'
import SettingsPage from './settingsPage'
import SetupFeedPage from './setupFeedPage'

import '../App.css'

import {
  loadingAppStates,
  createFeed,
  fetchFeed,
  postToFeed,
  toggleLock,
  transferOwnership,
  destroyFeed,
  loadFeedList } from '../actions'

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
      toggleLock,
      transferOwnership,
      destroy,
      createFeed } = this.props

    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' render={(routeProps) =>
              <HomePage {...routeProps}
                loadFeedListRequestState={this.props.loadFeedListRequestState}
                loadFeedList={this.props.loadFeedList}
                feedRecords={this.props.feedRecords} />
            } />
            <Route exact path='/feed/new' render={(routeProps) =>
              <SetupFeedPage
                {...routeProps}
                onCreateFeed={createFeed} />
            } />
            <Route path='/feed/:contractAddress/settings' render={(routeProps) =>
              <SettingsPage
                {... routeProps}
                {... feed}
                isOwner={isOwner}
                onLockToggled={toggleLock}
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
    feedRecords: state.feedRecords,
    isOwner: isOwner,
    postToFeed: state.postToFeed,
    loadFeedListRequestState: state.actions.loadFeedList.requestStatus
  }
}

// More this down, not needed
const mapDispatchToProps = dispatch => {
  return {
    loadOpenWitFeed: contractAddress => {
      return dispatch(fetchFeed(contractAddress))
    },
    addPostToOpenWitFeed: postText => {
      return dispatch(postToFeed(postText))
    },
    toggleLock: isLocked => {
      return dispatch(toggleLock(isLocked))
    },
    transferOwnership: accountAddress => {
      return dispatch(transferOwnership(accountAddress))
    },
    destroy: () => {
      return dispatch(destroyFeed())
    },
    createFeed: (title, author) => {
      return dispatch(createFeed(title, author))
    },
    loadFeedList: () => {
      return dispatch(loadFeedList())
    }
  }
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppLoadingProcess)

export default AppContainer
