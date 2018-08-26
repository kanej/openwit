import React, { Component } from 'react'
import PropTypes from 'prop-types'
import bind from 'lodash/bind'

import FeedIntroPanel from './feedIntroPanel'
import { fetchFeedStatuses } from '../actions'
import LoadingPanel from './loadingPanel'
import ErrorPanel from './errorPanel'
import BannedPannel from './bannedPanel'

class FeedPage extends Component {
  async componentDidMount () {
    const contractAddress = this.props.match.params.contractAddress

    if (this.props.requestStatus === fetchFeedStatuses.UNLOADED || this.props.feedAddress !== contractAddress) {
      this.props.loadOpenWitFeed(contractAddress)
    }
  }

  render () {
    if (this.props.requestStatus === fetchFeedStatuses.UNLOADED || this.props.requestStatus === fetchFeedStatuses.REQUESTED) {
      const {match} = this.props
      const contractAddress = match.params.contractAddress
      return (
        <div className='App'>
          <LoadingPanel byline={`Starting lookup of feed at ${contractAddress} on the blockchain ...`} />
        </div>
      )
    }

    if (this.props.requestStatus === fetchFeedStatuses.REQUEST_FAILED) {
      return (
        <div className='App'>
          <ErrorPanel byline={'Feed retrieval failed'} errorMessage={this.props.errorMessage} />
        </div>
      )
    }

    if (this.props.feedState === 'Banned') {
      return (
        <div className='App'>
          <BannedPannel />
        </div>
      )
    }

    return (
      <div className='App'>
        <FeedIntroPanel
          contractAddress={this.props.contractAddress}
          postToFeed={this.props.postToFeed}
          isOwner={this.props.isOwner}
          feed={this.props.feed}
          feedState={this.props.feedState}
          paused={this.props.paused}
          onPostAdded={this.props.onPostAdded}
          onSettingsClicked={bind(this._navigateToSettings, this)}
          onOpenWitHomeClicked={bind(this._navigateToHome, this)}
          onReportPost={this.props.onReportPost}
        />
      </div>
    )
  }

  async _navigateToHome (e) {
    e.preventDefault()
    this.props.history.push('/')
  }

  async _navigateToSettings () {
    this.props.history.push(`${this.props.match.url}/settings`)
  }
}

FeedPage.propTypes = {
  feedState: PropTypes.string,
  contractAddress: PropTypes.string,
  postToFeed: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  requestStatus: PropTypes.string.isRequired,
  loadOpenWitFeed: PropTypes.func.isRequired,
  onPostAdded: PropTypes.func.isRequired
}

export default FeedPage
