const fs = require('fs')
const Web3 = require('web3')
// const ganache = require('ganache-cli');

const { getBytes32FromMultihash, getMultihashFromContractResponse } = require('./src/multihash')

// const web3 = new Web3();

// // create a ganache-provider
// const ganacheProvider = ganache.provider({
//     accounts: [
//         // we preset the balance of our creatorIdentity to 10 ether
//         {
//             secretKey: userIdentity.privateKey,
//             balance: web3.toWei('10', 'ether')
//         },
//         // we also give some wei to the recieverIdentity
//         // so it can send transaction to the chain
//         {
//             secretKey: readerIdentity.privateKey,
//             balance: web3.toWei('1', 'ether')
//         }
//     ]
// });

// // set ganache to web3 as provider
// web3.setProvider(ganacheProvider);

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
      const hash = 'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8'
      const { digest, hashFunction, size } = getBytes32FromMultihash(hash)

      console.log(digest)
      console.log(hashFunction)
      console.log(size)

      const response = await feedInstance.methods.setFeed(
        digest,
        hashFunction,
        size).send({ from: senderAddress, gas: 300000 })

      console.log(response)

    // Note that the returned "myContractReturned" === "myContract",
    // so the returned "myContractReturned" object will also get the address set.
    })
})
