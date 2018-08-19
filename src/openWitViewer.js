import {getCidv1FromBytes, getBytesFromCidv1} from './multihash'

export default class OpenWitViewer {
  static async getOpenWitFeed (contractAddress, {openWit, feedReader, feedUpdatedCallback}) {
    try {
      const contract = await openWit.at(contractAddress)
      const owner = await contract.owner.call()
      const [version, codec, hash, size, digest] = await contract.getFeed()
      const feed = await OpenWitViewer._loadFeedFromCidParts(feedReader, { version, codec, hash, size, digest })

      const contractWatchCanceller = contract.allEvents().watch(async (err, res) => {
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

      return {status: 'success', content: {feed, owner, contract, contractWatchCanceller}}
    } catch (e) {
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
    updatedFeed.author = { name: 'Cicero' }

    return {status: 'success', content: {feed: updatedFeed}}
  }

  static async transferOwnership (newOwnerAccountAddress, {contract, currentWeb3Account}) {
    await contract.transferOwnership(newOwnerAccountAddress, { from: currentWeb3Account })

    return {status: 'success'}
  }

  static async _loadFeedFromCidParts (feedReader, { version, codec, hash, size, digest }) {
    const cid = getCidv1FromBytes({ version, codec, hash, size, digest })

    const feed = await feedReader.loadFeedFromCid(cid)

    feed.author = { name: 'Cicero' }
    return feed
  }
}
