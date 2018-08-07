import Permawit from 'permawit'

class FeedReader {
  constructor ({ ipfs }) {
    this.ipfs = ipfs
    this.wit = new Permawit({ ipfs: ipfs })
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
    var iterator = feed.feedAsyncIterator()

    var isDone = false
    var messages = []
    while (!isDone) {
      var v = await iterator.next()
      isDone = v.done
      if (!isDone) {
        messages.push(v.value)
      }
    }

    return {
      title: feed.name,
      posts: messages
    }
  }
}

async function getFeedReader ({ ipfs }) {
  const feedReader = new FeedReader({ ipfs })
  await feedReader.init()
  return feedReader
}

export default getFeedReader
