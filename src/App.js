import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Appbar from './components/appbar'
import FeedIntroPanel from './components/feedIntroPanel'
import './App.css'
import ContractAddressInput from './components/contractAddressInput'
import bind from 'lodash/bind'

class App extends Component {
  constructor (props) {
    super(props)

    if (!['viewer', 'from-anchor-tag'].includes(props.mode)) {
      throw Error("Argument error: App requires a mode of either 'viewer' or 'from-anchor-tag'")
    }

    this.state = {
      mode: props.mode,
      accounts: props.accounts,
      address: props.address || null,
      feed: props.feed || null,
      owner: props.owner,
      contract: null,
      getOpenWitFeed: props.getOpenWitFeed,
      addPostToOpenWitFeed: props.addPostToOpenWitFeed
    }
  }
  render () {
    if (this.state.mode === 'viewer') {
      return (
        <div className='App'>
          <Appbar title='Openwit' />
          <ContractAddressInput onChange={(e) => this.contractAddressUpdate(e)} />
          <FeedIntroPanel
            owner={this.state.owner}
            accounts={this.state.accounts}
            feed={this.state.feed}
            onPostAdded={bind(this.onPostAdded, this)} />
        </div>
      )
    } else if (this.state.mode === 'from-anchor-tag') {
      return (
        <div className='App'>
          <Appbar title='Openwit' />
          <FeedIntroPanel
            owner={this.state.owner}
            accounts={this.state.accounts}
            feed={this.state.feed}
            onPostAdded={bind(this.onPostAdded, this)} />
        </div>
      )
    } else {
      throw Error('Unknown mode ' + this.state.mode)
    }
  }
  contractAddressUpdate (e) {
    const address = e.target.value

    if (!address || address.length !== 42 || !/^0x/g.test(address)) {
      console.log('Invalid address: ' + address)
      return
    }

    console.log('Loadings address ' + address + ' ...')

    this.state.getOpenWitFeed(address).then(({feed, contract, owner}) => {
      this.setState({
        'contract': contract,
        'feed': feed,
        'owner': owner,
        'address': address
      })
    }).catch(err => {
      throw err
    })
  }
  async onPostAdded (postText) {
    const {feed} = await this.state.addPostToOpenWitFeed(postText)

    this.setState({feed})
  }
}

App.propTypes = {
  mode: PropTypes.string.isRequired,
  accounts: PropTypes.array.isRequired,
  feed: PropTypes.object
}

export default App
