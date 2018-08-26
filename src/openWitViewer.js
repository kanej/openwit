import {getCidv1FromBytes, getBytesFromCidv1} from './multihash'

export default class OpenWitViewer {
  static async getOpenWitFeed (contractAddress, {openWit, registry, feedReader, feedUpdatedCallback}) {
    try {
      const contract = await openWit.at(contractAddress)
      const owner = await contract.owner.call()
      const paused = await contract.paused.call()
      const [version, codec, hash, size, digest] = await contract.getFeed()
      const feed = await OpenWitViewer._loadFeedFromCidParts(feedReader, { version, codec, hash, size, digest })
      const stateInt = await registry.feedStates.call(contractAddress)
      const state = OpenWitViewer._mapStateIntToString(stateInt)

      contract.allEvents().watch(async (err, res) => {
        if (err) {
          throw err
        }

        if (res.event === 'FeedUpdate') {
          const {version, codec, hashFunction, size, digest} = res.args

          const feed = await OpenWitViewer._loadFeedFromCidParts(feedReader, {version, codec, hash: hashFunction, size, digest})

          if (feedUpdatedCallback) {
            feedUpdatedCallback(feed)
          }
        }
      })

      return {status: 'success', content: {feed, owner, paused, state, contract}}
    } catch (e) {
      console.error(e)
      return {status: 'error', errorMessage: e.message}
    }
  }

  static async addPostToOpenWitFeed (postText, {openWit, feedReader, permawitFeed, contract, currentWeb3Account}) {
    const feedName = permawitFeed.title

    const updatedCid = await feedReader.wit.post({ feed: feedName, text: postText })

    const { version, codec, hash, size, digest } = getBytesFromCidv1(updatedCid)

    await contract.setFeed(
      version,
      codec,
      hash,
      size,
      digest,
      { from: currentWeb3Account })

    const updatedFeed = await feedReader.getFeed(feedName)

    return {status: 'success', content: {feed: updatedFeed}}
  }

  static async transferOwnership (newOwnerAccountAddress, {contract, currentWeb3Account}) {
    try {
      await contract.transferOwnership(newOwnerAccountAddress, { from: currentWeb3Account })

      return {status: 'success'}
    } catch (e) {
      return {status: 'error', errorMessage: e.message}
    }
  }

  static async destroy ({contract, currentWeb3Account}) {
    try {
      console.log('Destroying feed', contract)
      await contract.destroy({
        from: currentWeb3Account,
        gas: 300000
      })

      return {status: 'success'}
    } catch (e) {
      console.log(e)
      return {status: 'error', errorMessage: e.message}
    }
  }

  static async toggleLock (lockFlag, {contract, currentWeb3Account}) {
    try {
      if (lockFlag) {
        await contract.pause({from: currentWeb3Account})
      } else {
        await contract.unpause({from: currentWeb3Account})
      }

      return {status: 'success'}
    } catch (e) {
      console.log(e)
      return {status: 'error', errorMessage: e.message}
    }
  }

  static async createFeed (title, author, {currentWeb3Account, registry, feedReader}) {
    try {
      const feed = await feedReader.wit.createFeed({ name: title, author })
      const feedHash = feed.getHash()

      const { version, codec, hash, size, digest } = getBytesFromCidv1(feedHash)

      const result = await registry.create(
        version,
        codec,
        hash,
        size,
        digest,
        {
          from: currentWeb3Account,
          value: 100
        })

      const newFeedAddress = result.logs[0].args.newAddress

      return {status: 'success', content: { newFeedAddress }}
    } catch (e) {
      console.log(e)
      return {status: 'error', errorMessage: e.message}
    }
  }

  static async getOpenWitFeedSummaries ({registry, openWit, feedReader}) {
    try {
      const feedRecords = []
      const feedAddresses = await registry.getAllFeeds.call()
      for (var contractAddress of feedAddresses) {
        const feedContract = await openWit.at(contractAddress)
        const [ version, codec, hash, size, digest ] = await feedContract.getFeed.call()
        var {title, author} = await OpenWitViewer._loadFeedFromCidParts(feedReader, { version, codec, hash, size, digest })
        feedRecords.push({title, author, contractAddress})
      }

      return { status: 'success', content: { feedRecords: feedRecords } }
    } catch (e) {
      console.log(e)

      return {status: 'error', errorMessage: e.message}
    }
  }

  static async reportFeed ({contractAddress, registry, currentWeb3Account}) {
    console.log('Open Wit report feed')

    try {
      await registry.requestConductCheck(contractAddress, {from: currentWeb3Account})

      return { status: 'success', content: {} }
    } catch (e) {
      console.log(e)

      return {status: 'error', errorMessage: e.message}
    }
  }

  static async _loadFeedFromCidParts (feedReader, { version, codec, hash, size, digest }) {
    const cid = getCidv1FromBytes({ version, codec, hash, size, digest })

    const feed = await feedReader.loadFeedFromCid(cid)

    return feed
  }

  static _mapStateIntToString (stateInt) {
    switch (stateInt.toNumber()) {
      case 0:
        return 'Nonexistant'
      case 1:
        return 'GoodStanding'
      case 2:
        return 'UnderReview'
      case 3:
        return 'Banned'
      default:
        return 'Unknown'
    }
  }
}
