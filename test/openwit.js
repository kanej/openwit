var OpenWit = artifacts.require('./OpenWit.sol')
const { getBytesFromCidv1, getCidv1FromBytes } = require('../src/multihash')

// What is the fallback function doing?
// How is money dealt with in destruction and ownership transfer?

contract('OpenWit - as owner', function (accounts) {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  let openWitInstance

  it('should store the ipfs hash of the feed', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance

      const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

      return openWitInstance.setFeed(
        version,
        codec,
        hash,
        size,
        digest,
        { from: accounts[0] })
    }).then(function () {
      return openWitInstance.getFeed.call()
    }).then(function (storedData) {
      const [version, codec, hash, size, digest] = storedData

      assert.equal(getCidv1FromBytes({ version, codec, hash, size, digest }), cidv1, "The cid doesn't match")
    })
  })

  it('should transfer ownership of the contract', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.transferOwnership(accounts[1], { from: accounts[0] })
    }).then(function () {
      return openWitInstance.owner()
    }).then(function (owner) {
      assert.equal(accounts[1], owner)
    })
  })
})

contract('OpenWit - as non-owner', function (accounts) {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  let openWitInstance

  it('should allow retrieval of the owner of the contract', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.owner()
    }).then(function (owner) {
      assert.equal(accounts[0], owner)
    })
  })

  it('should revert an ipfs hash update', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance

      const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

      return openWitInstance.setFeed(
        version,
        codec,
        hash,
        size,
        digest,
        { from: accounts[1] })
    }).then(function (storedData) {
      assert.fail()
    }).catch(err => {
      assert.isTrue(/revert/.test(err.message))
    })
  })

  it('should revert if ownership transfer', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.transferOwnership(accounts[1], { from: accounts[1] })
    }).then(function (storedData) {
      assert.fail()
    }).catch(err => {
      assert.isTrue(/revert/.test(err.message))
    })
  })
})

contract('OpenWit - is destructible', function (accounts) {
  let openWitInstance

  it('should be be destroyable by owner', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance
      return openWitInstance.destroy({ from: accounts[0] })
    }).then(function () {
      return openWitInstance.owner()
    }).catch(err => {
      assert.isTrue(/is not a contract address/.test(err.message))
    })
  })
})
