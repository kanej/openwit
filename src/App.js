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
      feed: props.feed || null,
      getOpenWitFeed: props.getOpenWitFeed
    }
  }
  render () {
    if (this.state.mode === 'viewer') {
      return (
        <div className='App'>
          <Appbar title='Openwit' />
          <ContractAddressInput onChange={(e) => this.contractAddressUpdate(e)} />
          <FeedIntroPanel feed={this.state.feed} />
        </div>
      )
    } else if (this.state.mode === 'from-anchor-tag') {
      return (
        <div className='App'>
          <Appbar title='Openwit' />
          <FeedIntroPanel feed={this.state.feed} />
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

    this.state.getOpenWitFeed(address).then(feed => {
      console.log(feed)
      console.log(this.state)
      this.setState({'feed': feed})
    }).catch(err => {
      throw err
    })
  }
}

App.propTypes = {
  mode: PropTypes.string.isRequired,
  feed: PropTypes.object
}

export default App
