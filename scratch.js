const fs = require('fs')
const Web3 = require('web3')
const { getBytesFromCidv1, getCidv1FromBytes } = require('./src/multihash')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const simpleTruffleOutput = JSON.parse(fs.readFileSync('./build/contracts/OpenWit.json'))
var openWitAbi = simpleTruffleOutput.abi
const simpleTwitBytecode = simpleTruffleOutput.bytecode

web3.eth.estimateGas({
  data: simpleTwitBytecode
}).then(gasEstimate => {
  let senderAddress = '0x8bedb0d4ffdd798317f32dec8c2bb0a8d044987f'

  const OpenWitContract = new web3.eth.Contract(openWitAbi, {
    from: senderAddress,
    gas: gasEstimate
  })

  OpenWitContract.deploy({ data: simpleTwitBytecode })
    .send({
      from: senderAddress,
      gas: gasEstimate
    // gasPrice: '30000000000000'
    // gas: gasEstimate
    // gasPrice: 30000000000000
    })
    .then(async function (feedInstance) {
    // NOTE: The callback will fire twice!
    // Once the contract has the transactionHash property set and once its deployed on an address.

    // e.g. check tx hash on the first call (transaction send)

      // console.log(feedInstance) // the contract address
      const cid = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
      const { version, codec, hash, size, digest } = getBytesFromCidv1(cid)

      // console.log(version)
      // console.log(codec)
      // console.log(hash)
      // console.log(size)
      // console.log(digest)

      const response = await feedInstance.methods.setFeed(
        version,
        codec,
        hash,
        size,
        digest).send({ from: senderAddress, gas: 300000 })

      console.log(response)
    })
})
