import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Appbar from './components/appbar'
import FeedIntroPanel from './components/feedIntroPanel'
import './App.css'
import ContractAddressInput from './components/contractAddressInput'

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
      owner: null,
      contract: null,
      getOpenWitFeed: props.getOpenWitFeed
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
            feed={this.state.feed} />
        </div>
      )
    } else if (this.state.mode === 'from-anchor-tag') {
      return (
        <div className='App'>
          <Appbar title='Openwit' />
          <FeedIntroPanel
            owner={this.state.owner}
            accounts={this.state.accounts}
            feed={this.state.feed} />
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
      console.log('owner', owner)

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
}

App.propTypes = {
  mode: PropTypes.string.isRequired,
  accounts: PropTypes.array.isRequired,
  feed: PropTypes.object
}

export default App
