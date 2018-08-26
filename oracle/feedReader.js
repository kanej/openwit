const Permawit = require('permawit')

class FeedReader {
  constructor ({ ipfs, store }) {
    this.ipfs = ipfs

    if (store) {
      this.wit = new Permawit({ ipfs: ipfs, store })
    } else {
      this.wit = new Permawit({ ipfs: ipfs })
    }
  }

  async init () {
    await this.wit.init()
  }

  async loadFeedFromCid (cid) {
    const feed = await this.wit.loadFeed({ cid: cid })
    return this.convertToOpenWitFeed(feed)
  }

  async getFeed (feedName) {
    const feed = await this.wit.getFeed(feedName)

    return this.convertToOpenWitFeed(feed)
  }

  async convertToOpenWitFeed (feed) {
    const metadata = await feed.getMetadata()
    var iterator = feed.feedAsyncIterator()

    var isDone = false
    var messages = []
    while (!isDone) {
      var v = await iterator.next()
      isDone = v.done
      if (!isDone && v.value) {
        messages.push(v.value)
      }
    }

    return {
      title: feed.name,
      author: metadata.author,
      hash: metadata.hash,
      posts: messages
    }
  }
}

async function getFeedReader ({ ipfs, store }) {
  const feedReader = new FeedReader({ ipfs, store })
  await feedReader.init()
  return feedReader
}

module.exports = getFeedReader
