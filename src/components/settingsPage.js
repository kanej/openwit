import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SettingsPanel from './settingsPanel'
import { fetchFeedStatuses } from '../actions'
import LoadingPanel from './loadingPanel'
import ErrorPanel from './errorPanel'

class SettingsPage extends Component {
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
      console.log(this.props.requestStatus)
      return (
        <div className='App'>
          <ErrorPanel byline={'Settings for Feed retrieval failed'} errorMessage={this.props.errorMessage} />
        </div>
      )
    }

    const {isOwner} = this.props

    if (!isOwner) {
      return (
        <div className='App'>
          <ErrorPanel byline={'Not Authorised'} errorMessage={'You are not the owner of this feed'} />
        </div>
      )
    }

    return (
      <div className='App'>
        <SettingsPanel
          {...this.props}
          feedName={this.props.feed ? this.props.feed.title : null}
          contractAddress={this.props.feedAddress}
          onOwnershipTransfer={this.props.onOwnershipTransfer} />
      </div>
    )
  }
}

SettingsPage.propTypes = {
  requestStatus: PropTypes.string.isRequired,
  feedName: PropTypes.string,
  feedAddress: PropTypes.string,
  onOwnershipTransfer: PropTypes.func.isRequired
}

export default SettingsPage
