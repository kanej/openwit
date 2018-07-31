import React from 'react'
import ReactDOM from 'react-dom'

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
  }

  async init () {
    const openWit = contract(OpenWitContract)
    openWit.setProvider(this.web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWit)
    let contractAddress
    if (this.mode === 'from-anchor-tag') {
      contractAddress = window.location.hash.slice(1)
    } else {
      throw Error('Only anchor tag mode supported currently')
    }

    var contractInstance = await openWit.at(contractAddress)

    const [version, codec, hash, size, digest] = await contractInstance.getFeed()
    const cid = getCidv1FromBytes({ version, codec, hash, size, digest })
    let feedReader = await getFeedReader({ ipfs: this.ipfs })
    const feed = await feedReader.getFeed(cid)
    feed.author = { name: 'Cicero' }
    window.feed = feed
    ReactDOM.render(
      <App feed={feed} />,
      document.getElementById(this.el))
  }
}
