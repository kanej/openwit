import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import registerServiceWorker from './registerServiceWorker'
import getWeb3 from './getWeb3'
import getIpfs from 'window.ipfs-fallback'
import getFeedReader from './feedReader'

import {getCidv1FromBytes} from './multihash'

import OpenWitContract from './contracts/OpenWit.json'

import contract from 'truffle-contract'

import { fixTruffleContractCompatibilityIssue } from './utils/fixes'

const mode = 'from-anchor-tag' // 'widget' 'hardcoded'

const config = {
  mode
}

// Setup a very simple async setup function to run on page load
const setup = async () => {
  try {
    // registerServiceWorker()
    let ipfs = await getIpfs() // Init an IPFS peer node
    // await ipfs.swarm.connect('/ip4/127.0.0.1/tcp/9999/ws/ipfs/QmRJepitjCzY3eN22mXojCZTpZNrEGnPdjKxrpR9nxsDq2')
    const id = await ipfs.id() // Get the peer id info
    console.log(`Running ${id.agentVersion} with ID ${id.id}`)

    getWeb3
      .then(async results => {
        const web3 = results.web3

        // const accounts = await web3.eth.getAccounts()

        const openWit = contract(OpenWitContract)
        openWit.setProvider(web3.currentProvider)
        fixTruffleContractCompatibilityIssue(openWit)
        let contractAddress
        if (config.mode === 'from-anchor-tag') {
          contractAddress = window.location.hash.slice(1)
        } else {
          throw Error('Only anchor tag mode supported currently')
        }

        var contractInstance = await openWit.at(contractAddress)

        const [version, codec, hash, size, digest] = await contractInstance.getFeed()
        const cid = getCidv1FromBytes({ version, codec, hash, size, digest })
        let feedReader = await getFeedReader({ ipfs })
        const feed = await feedReader.getFeed(cid)
        feed.author = { name: 'Cicero' }
        window.feed = feed
        ReactDOM.render(
          <App feed={feed} />,
          document.getElementById('root'))
      })
      .catch((web3err) => {
        console.log(web3err)
      })
  } catch (err) {
    console.log(err) // Just pass along the error
  }
}

setup()
