var SimpleTwit = artifacts.require('./OpenWit.sol')
const { getBytesFromCidv1, getCidv1FromBytes } = require('../src/multihash')

contract('OpenWit', function (accounts) {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  let simpleStorageInstance

  it('...should store the ipfs hash of the feed', function () {
    return SimpleTwit.deployed().then(function (instance) {
      simpleStorageInstance = instance

      const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

      return simpleStorageInstance.setFeed(
        version,
        codec,
        hash,
        size,
        digest,
        { from: accounts[0] })
    }).then(function () {
      return simpleStorageInstance.getFeed.call()
    }).then(function (storedData) {
      const [version, codec, hash, size, digest] = storedData

      assert.equal(getCidv1FromBytes({ version, codec, hash, size, digest }), cidv1, "The cid doesn't match")
    })
  })
})
