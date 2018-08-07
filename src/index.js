import './index.css'

// import registerServiceWorker from './registerServiceWorker'
import getWeb3 from './getWeb3'
import getIpfs from 'window.ipfs-fallback'

import OpenWitViewer from './openWitViewer'

const mode = 'from-anchor-tag' // 'widget' 'hardcoded'

const setup = async () => {
  try {
    // registerServiceWorker()
    let ipfs = await getIpfs() // Init an IPFS peer node
    const id = await ipfs.id() // Get the peer id info
    console.log(`Running ${id.agentVersion} with ID ${id.id}`)

    if (id.id !== 'QmRJepitjCzY3eN22mXojCZTpZNrEGnPdjKxrpR9nxsDq2') {
      await ipfs.swarm.connect('/ip4/127.0.0.1/tcp/9999/ws/ipfs/QmRJepitjCzY3eN22mXojCZTpZNrEGnPdjKxrpR9nxsDq2')
    }

    let web3 = (await getWeb3).web3

    const viewer = new OpenWitViewer({
      el: 'root',
      mode: mode,
      ipfs: ipfs,
      web3: web3
    })

    window.viewer = viewer

    viewer.init()
  } catch (err) {
    console.log(err) // Just pass along the error
  }
}

setup()
