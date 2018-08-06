import React from 'react'
import ReactDOM from 'react-dom'
import bind from 'lodash/bind'

import App from './App'
import getFeedReader from './feedReader'

import {getCidv1FromBytes} from './multihash'

import OpenWitContract from './contracts/OpenWit.json'

import contract from 'truffle-contract'

import { fixTruffleContractCompatibilityIssue } from './utils/fixes'

export default class OpenWitViewer {
  constructor (options) {
    this.el = options.el
    this.mode = options.mode
    this.ipfs = options.ipfs
    this.web3 = options.web3

    this.openWit = null
  }

  async init () {
    const openWit = contract(OpenWitContract)
    openWit.setProvider(this.web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWit)
    this.openWit = openWit

    if (this.mode === 'from-anchor-tag') {
      let contractAddress = window.location.hash.slice(1)

      const feed = await this.getOpenWitFeed(contractAddress)

      ReactDOM.render(
        <App mode={this.mode} feed={feed} />,
        document.getElementById(this.el))
    } else if (this.mode === 'viewer') {
      ReactDOM.render(
        <App
          mode={this.mode}
          getOpenWitFeed={bind(this.getOpenWitFeed, this)} />,
        document.getElementById(this.el))
    } else {
      throw Error('Only viewer and anchor tag mode supported currently')
    }
  }

  async getOpenWitFeed (contractAddress) {
    var contractInstance = await this.openWit.at(contractAddress)
    const [version, codec, hash, size, digest] = await contractInstance.getFeed()
    const cid = getCidv1FromBytes({ version, codec, hash, size, digest })
    let feedReader = await getFeedReader({ ipfs: this.ipfs })
    const feed = await feedReader.getFeed(cid)
    feed.author = { name: 'Cicero' }
    return feed
  }
}
