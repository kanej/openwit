import React from 'react'
import ReactDOM from 'react-dom'
import bind from 'lodash/bind'
import contract from 'truffle-contract'

import App from './App'
import getFeedReader from './feedReader'
import {getCidv1FromBytes, getBytesFromCidv1} from './multihash'
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

      const {feed, owner, contract} = await this.getOpenWitFeed(contractAddress)

      ReactDOM.render(
        <App
          mode={this.mode}
          feed={feed}
          owner={owner}
          contract={contract}
          accounts={this.accounts}
          getOpenWitFeed={bind(this.getOpenWitFeed, this)}
          addPostToOpenWitFeed={bind(this.addPostToOpenWitFeed, this)} />,
        document.getElementById(this.el))
    } else if (this.mode === 'viewer') {
      ReactDOM.render(
        <App
          mode={this.mode}
          accounts={this.accounts}
          getOpenWitFeed={bind(this.getOpenWitFeed, this)}
          onPostAdded={bind(this.addPostToOpenWitFeed, this)} />,
        document.getElementById(this.el))
    } else {
      throw Error('Only viewer and anchor tag mode supported currently')
    }
  }

  async getOpenWitFeed (contractAddress) {
    try {
      const contract = await this.openWit.at(contractAddress)
      const [version, codec, hash, size, digest] = await contract.getFeed()
      const owner = await contract.owner.call()
      const cid = getCidv1FromBytes({ version, codec, hash, size, digest })
      const feedReader = await getFeedReader({ ipfs: this.ipfs })
      const feed = await feedReader.loadFeedFromCid(cid)
      feed.author = { name: 'Cicero' }

      this.feedReader = feedReader
      this.feed = feed
      this.contract = contract

      return {feed, owner, contract}
    } catch (e) {
      console.log(e)
    }
  }

  async addPostToOpenWitFeed (postText) {
    const feedName = this.feed.title

    const updatedCid = await this.feedReader.wit.post({ feed: feedName, text: postText })

    const { version, codec, hash, size, digest } = getBytesFromCidv1(updatedCid)

    await this.contract.setFeed(
      version,
      codec,
      hash,
      size,
      digest,
      { from: this.accounts[0] })

    const updatedFeed = await this.feedReader.getFeed(feedName)
    updatedFeed.author = { name: 'Cicero' }
    return {feed: updatedFeed}
  }
}
