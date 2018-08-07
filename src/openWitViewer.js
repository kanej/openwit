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
    this.feedReader = null
  }

  async init () {
    const openWit = contract(OpenWitContract)
    openWit.setProvider(this.web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWit)
    this.openWit = openWit

    this.accounts = await this.web3.eth.getAccounts()

    this.feedReader = await getFeedReader({ ipfs: this.ipfs })

    ReactDOM.render(
      <App
        mode={this.mode}
        getOpenWitFeed={bind(this.getOpenWitFeed, this)}
        addPostToOpenWitFeed={bind(this.addPostToOpenWitFeed, this)}
        feed={null}
        owner={null}
        contract={null}
        accounts={this.accounts} />,
      document.getElementById(this.el))
  }

  async getOpenWitFeed (contractAddress, callback) {
    try {
      const contract = await this.openWit.at(contractAddress)

      const owner = await contract.owner.call()

      const [version, codec, hash, size, digest] = await contract.getFeed()

      const feed = await this._loadFeedFromCidParts({ version, codec, hash, size, digest })

      this.feed = feed
      this.contract = contract

      contract.allEvents().watch(async (err, res) => {
        if (err) {
          throw err
        }

        if (res.event === 'FeedUpdate') {
          const {version, codec, hashFunction, size, digest} = res.args

          this.feed = await this._loadFeedFromCidParts({version, codec, hash: hashFunction, size, digest})
          console.log(callback)
          if (callback) {
            callback(this.feed)
          }
        }
      })

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

  async _loadFeedFromCidParts ({ version, codec, hash, size, digest }) {
    const cid = getCidv1FromBytes({ version, codec, hash, size, digest })

    const feed = await this.feedReader.loadFeedFromCid(cid)
    feed.author = { name: 'Cicero' }
    return feed
  }
}
