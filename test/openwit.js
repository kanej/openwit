var SimpleTwit = artifacts.require('./OpenWit.sol')
const { getBytesFromCidv1, getCidv1FromBytes } = require('../src/multihash')

contract('OpenWit', function (accounts) {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  let openWitInstance

  it('...should store the ipfs hash of the feed if triggered by owner', function () {
    return SimpleTwit.deployed().then(function (instance) {
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

  it('...should revert an ipfs hash update if triggered by other than owner', function () {
    return SimpleTwit.deployed().then(function (instance) {
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
      assert.exists(err)
    })
  })

  it('...should allow retrieval of the owner of the contract', function () {
    return SimpleTwit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.owner()
    }).then(function (owner) {
      assert.equal(accounts[0], owner)
    })
  })

  it('...should transfer ownership of the contract if triggered by owner', function () {
    return SimpleTwit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.transferOwnership(accounts[1], { from: accounts[0] })
    }).then(function () {
      return openWitInstance.owner()
    }).then(function (owner) {
      assert.equal(accounts[1], owner)
    })
  })

  it('...should revert if ownership transfer triggered by other than owner', function () {
    return SimpleTwit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.transferOwnership(accounts[1], { from: accounts[1] })
    }).then(function (storedData) {
      assert.fail()
    }).catch(err => {
      assert.exists(err)
    })
  })
})
