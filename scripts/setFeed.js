const fs = require('fs')
const Web3 = require('web3')
const truffleContract = require('truffle-contract')
const { fixTruffleContractCompatibilityIssue } = require('../src/utils/fixes')

const { getBytesFromCidv1 } = require('../src/multihash')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const simpleTruffleOutput = JSON.parse(fs.readFileSync('./build/contracts/OpenWit.json'))
// var openWitAbi = simpleTruffleOutput.abi
// const simpleTwitBytecode = simpleTruffleOutput.bytecode
const setup = async () => {
  const openWitContract = truffleContract(simpleTruffleOutput)
  openWitContract.setProvider(web3.currentProvider)
  fixTruffleContractCompatibilityIssue(openWitContract)

  const accounts = await web3.eth.getAccounts()

  const contractInstance = await openWitContract.deployed()
  const cid = 'zdpuAqqmRH5FkZmsuWbopTpaXVDQ7PQyNDCd4GwHX6r17W7eU'
  const { version, codec, hash, size, digest } = getBytesFromCidv1(cid)

  await contractInstance.setFeed(
    version,
    codec,
    hash,
    size,
    digest,
    { from: accounts[0] })
}

setup()
