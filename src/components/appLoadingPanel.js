import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { loadingAppStates } from '../actions'

import LoadingPanel from './loadingPanel'

class AppLoadingPanel extends Component {
  render () {
    const { loadingStatus } = this.props

    const byline = this._mapLoadingStatusToByline(loadingStatus)

    return (
      <div className='App'>
        <LoadingPanel byline={byline} />
      </div>
    )
  }

  _mapLoadingStatusToByline (loadingStatus) {
    switch (loadingStatus) {
      case loadingAppStates.INITIALIZING:
        return 'Booting ...'
      case loadingAppStates.IPFS_LOADING:
        return 'Plugging into IPFS from across the stars ...'
      case loadingAppStates.WEB3_LOADING:
        return 'Contacting Web3 through a hole in space time ...'
      case loadingAppStates.IPFS_LOAD_FAILED:
      case loadingAppStates.WEB3_LOAD_FAILED:
        return 'Failed loading web3: ' + this.props.loadingErrorMessage
      default:
        return ''
    }
  }
}

AppLoadingPanel.propTypes = {
  loadingStatus: PropTypes.string,
  loadingErrorMessage: PropTypes.string
}

export default AppLoadingPanel
