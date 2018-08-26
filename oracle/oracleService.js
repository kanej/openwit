const _ = require('lodash')

const ipfsAPI = require('ipfs-api')
const MemoryStore = require('../src/utils/memoryStore')
const getFeedReader = require('./feedReader')

const fs = require('fs')
const Web3 = require('web3')
const truffleContract = require('truffle-contract')
const { fixTruffleContractCompatibilityIssue } = require('../src/utils/fixes')

const { getCidv1FromBytes } = require('../src/multihash')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const openWitRegistryAbi = JSON.parse(fs.readFileSync('./build/contracts/OpenWitRegistry.json'))
const openWitOracleAbi = JSON.parse(fs.readFileSync('./build/contracts/OpenWitOracle.json'))
const openWitAbi = JSON.parse(fs.readFileSync('./build/contracts/OpenWit.json'))

const CHECK_REQUESTED = 0
const CHECK_PASSED = 1
const CHECK_FAILED = 2

const checkPostMeetsCodeOfConduct = (post) => {
  var postParts = post
    .replace(/\n/g, ' ')
    .replace(/"/g, ' ')
    .replace(/'/g, ' ')
    .split(' ')

  if (postParts.includes('inheritance')) {
    return false
  }

  return true
}

const runOracle = async () => {
  console.info('Open Wit Oracle Service starting...')

  console.info('Connecting to local ipfs node ...')

  var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
  const feedReader = await getFeedReader({ ipfs, store: new MemoryStore() })

  console.info('Loading ethereum contracts...')
  let accounts, oracle, openWitContract, openWitRegistryContract
  try {
    accounts = await web3.eth.getAccounts()

    openWitRegistryContract = truffleContract(openWitRegistryAbi)
    openWitRegistryContract.setProvider(web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWitRegistryContract)

    const openWitOracleContract = truffleContract(openWitOracleAbi)
    openWitOracleContract.setProvider(web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWitOracleContract)

    openWitContract = truffleContract(openWitAbi)
    openWitContract.setProvider(web3.currentProvider)
    fixTruffleContractCompatibilityIssue(openWitContract)

    // registry = await openWitRegistryContract.deployed()
    oracle = await openWitOracleContract.deployed()
  } catch (e) {
    console.info('Failed to load ethereum contracts')
    console.error(e)
    process.exit(1)
  }

  console.log('Contracts loaded')

  console.log('Processing backlog from the beginning of time')

  oracle.allEvents({fromBlock: 0}).watch(async (err, log) => {
    if (err) {
      throw err
    }

    if (log.event !== 'FeedCheckRequested') {
      return
    }

    const {requestNo, contractAddress, requester, requestingRegistry} = log.args

    // Determine if the request is still to be processed
    const [,,,, stateNum] = await oracle.requests.call(requestNo)
    const state = stateNum.toNumber()

    if (state !== CHECK_REQUESTED) {
      console.info(`Ignoring request #${requestNo} as it has already been processed`)
      return
    }

    console.info(`Processing the request #${requestNo} - contract address ${contractAddress} - requester ${requester}`)

    const feedContractInstance = openWitContract.at(contractAddress)

    const [version, codec, hash, size, digest] = await feedContractInstance.getFeed()
    const ipfsHash = getCidv1FromBytes({ version, codec, hash, size, digest })

    const feed = await feedReader.loadFeedFromCid(ipfsHash)

    const passed = _.every(feed.posts, checkPostMeetsCodeOfConduct)
    const resultState = passed
      ? CHECK_PASSED
      : CHECK_FAILED

    console.log(`Request #${requestNo} processed with result - ${passed ? 'Passed' : 'Failed'}`)

    try {
      await oracle.answerFeedCheck(requestNo, resultState, {from: accounts[0]})
    } catch (ex) {
      console.error(ex)
      throw new Error('Attempting Oracle update on answer', ex.message)
    }

    try {
      const registry = openWitRegistryContract.at(requestingRegistry)
      await registry.updateFeedStateBasedOnConductCheck(requestNo, {from: accounts[0]})
    } catch (ex) {
      console.error(ex)
      throw new Error('Attempting registry update on answer', ex.message)
    }
  })
}

runOracle()
