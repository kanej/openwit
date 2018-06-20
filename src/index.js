import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import registerServiceWorker from './registerServiceWorker'
import getIpfs from 'window.ipfs-fallback'
import getFeedReader from './feedReader'

// Setup a very simple async setup function to run on page load
const setup = async () => {
  try {
    // registerServiceWorker()
    let ipfs = await getIpfs() // Init an IPFS peer node
    await ipfs.swarm.connect('/ip4/127.0.0.1/tcp/9999/ws/ipfs/QmRJepitjCzY3eN22mXojCZTpZNrEGnPdjKxrpR9nxsDq2')
    const id = await ipfs.id() // Get the peer id info
    console.log(`Running ${id.agentVersion} with ID ${id.id}`)

    let feedReader = await getFeedReader({ ipfs })
    const feed = await feedReader.getFeed('zdpuAqqmRH5FkZmsuWbopTpaXVDQ7PQyNDCd4GwHX6r17W7eU')
    feed.author = { name: 'Cicero' }
    window.feed = feed
    console.log(feed)
    ReactDOM.render(
      <App feed={feed} />,
      document.getElementById('root'))
  } catch (err) {
    console.log(err) // Just pass along the error
  }
}

setup()
