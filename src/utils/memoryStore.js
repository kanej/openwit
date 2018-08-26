class MemoryStore {
  constructor () {
    this.feeds = {}
  }

  init () {
    return new Promise((resolve) => {
      resolve()
    })
  }

  setFeed (name, ipfsHash) {
    return new Promise((resolve) => {
      this.feeds[name] = ipfsHash
      resolve()
    })
  }

  getFeed (name) {
    return new Promise((resolve) => {
      const ipfsHash = this.getFeedSync(name)
      resolve(ipfsHash)
    })
  }

  getFeedSync (name) {
    return this.feeds[name]
  }
}

module.exports = MemoryStore
