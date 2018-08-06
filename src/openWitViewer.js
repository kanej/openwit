import React from 'react'
import ReactDOM from 'react-dom'
import bind from 'lodash/bind'
import contract from 'truffle-contract'

import App from './App'
import getFeedReader from './feedReader'
import {getCidv1FromBytes} from './multihash'
import OpenWitContract from './contracts/OpenWit.json'
import { fixTruffleContractCompatibilityIssue } from './utils/fixes'

export default class OpenWitViewer {
  constructor (options) {
    this.el = options.el
    this.mode = options.mode
    this.ipfs = options.ipfs
    this.web3 = options.web3

    this.openWit = null
    this.accounts = null
  }

  async init () {
    const openWit = contract(OpenWitContract)
    openWit.setProvider(this.web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWit)
    this.openWit = openWit

    this.accounts = await this.web3.eth.getAccounts()

    if (this.mode === 'from-anchor-tag') {
      let contractAddress = window.location.hash.slice(1)

      const feed = await this.getOpenWitFeed(contractAddress)

      ReactDOM.render(
        <App
          mode={this.mode}
          feed={feed}
          accounts={this.accounts} />,
        document.getElementById(this.el))
    } else if (this.mode === 'viewer') {
      ReactDOM.render(
        <App
          mode={this.mode}
          getOpenWitFeed={bind(this.getOpenWitFeed, this)}
          accounts={this.accounts} />,
        document.getElementById(this.el))
    } else {
      throw Error('Only viewer and anchor tag mode supported currently')
    }
  }

  async getOpenWitFeed (contractAddress) {
    try {
      const contractInstance = await this.openWit.at(contractAddress)
      const [version, codec, hash, size, digest] = await contractInstance.getFeed()
      const owner = await contractInstance.owner.call()
      const cid = getCidv1FromBytes({ version, codec, hash, size, digest })
      const feedReader = await getFeedReader({ ipfs: this.ipfs })
      const feed = await feedReader.getFeed(cid)
      feed.author = { name: 'Cicero' }
      return {feed, owner, contract: contractInstance}
    } catch (e) {
      console.log(e)
    }
  }
}
