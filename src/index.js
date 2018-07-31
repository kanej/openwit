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

    let web3 = (await getWeb3).web3

    const viewer = new OpenWitViewer({
      el: 'root',
      mode: mode,
      ipfs: ipfs,
      web3: web3
    })

    viewer.init()
  } catch (err) {
    console.log(err) // Just pass along the error
  }
}

setup()
