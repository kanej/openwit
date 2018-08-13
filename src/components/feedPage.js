import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import bind from 'lodash/bind'

import FeedIntroPanel from './feedIntroPanel'
import SettingsPanel from './settingsPanel'

class FeedPage extends Component {
  constructor (props) {
    super(props)

    const {match} = props
    const contractAddress = match.params.contractAddress

    const {
      accounts,
      getOpenWitFeed,
      addPostToOpenWitFeed,
      onOwnershipTransfer} = props

    this.state = {
      contractAddress,
      accounts,
      getOpenWitFeed: getOpenWitFeed,
      addPostToOpenWitFeed: addPostToOpenWitFeed,
      onOwnershipTransfer: onOwnershipTransfer,
      feed: null,
      owner: null,
      contract: null
    }
  }

  async componentDidMount () {
    const {feed, owner, contract} = await this.state.getOpenWitFeed(
      this.state.contractAddress,
      bind(this._updateFeed, this))

    this.setState({feed, owner, contract})
  }

  render () {
    const {match} = this.props
    const isOwner = this._isOwner()

    return (
      <div>
        <Switch>
          <Route exact path={`${match.url}`}>
            <div className='App'>
              <FeedIntroPanel
                isOwner={isOwner}
                feed={this.state.feed}
                onPostAdded={bind(this._onPostAdded, this)}
                onSettingsClicked={bind(this._navigateToSettings, this)}
                onOpenWitHomeClicked={bind(this._navigateToHome, this)} />
            </div>
          </Route>
          <Route exact path={`${match.url}/settings`}>
            <div className='App'>
              <SettingsPanel
                {...this.props}
                feedName={this.state.feed ? this.state.feed.title : 'loading'}
                contractAddress={this.state.contractAddress}
                onOwnershipTransfer={this.state.onOwnershipTransfer} />
            </div>
          </Route>
        </Switch>

      </div>
    )
  }

  async _navigateToSettings () {
    this.props.history.push(`${this.props.match.url}/settings`)
  }

  async _navigateToHome (e) {
    e.preventDefault()
    this.props.history.push('/')
  }

  async _onPostAdded (postText) {
    const {feed} = await this.state.addPostToOpenWitFeed(postText)

    this.setState({feed})
  }

  _updateFeed (feed) {
    this.setState({feed})
  }

  _isOwner () {
    return this.state.accounts !== undefined &&
        this.state.accounts.length > 0 &&
        this.state.owner === this.state.accounts[0].toLowerCase()
  }
}

FeedPage.propTypes = {
  accounts: PropTypes.array.isRequired,
  getOpenWitFeed: PropTypes.func.isRequired,
  addPostToOpenWitFeed: PropTypes.func.isRequired,
  onOwnershipTransfer: PropTypes.func.isRequired
}

export default FeedPage
