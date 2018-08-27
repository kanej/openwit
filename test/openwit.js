var OpenWit = artifacts.require('./OpenWit.sol')
const { getBytesFromCidv1, getCidv1FromBytes } = require('../src/multihash')

contract('OpenWit - as owner', function (accounts) {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  let openWitInstance

  // Test that a blog contract can be updated with a reference to its
  // data on IPFS
  it('should allow setting and updating of the ipfs hash of the feed', function () {
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

  // Test that after a feed transfer, the owner is the new owner
  // rather than the old one
  it('should allow transfer of ownership of the feed contract', function () {
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

  // Test that the IPFS hash encapsulating the feeds data is publicly queryable
  it('should allow retrieval of the ipfs hash of the feed', function () {
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
      return openWitInstance.getFeed.call({ from: accounts[1] })
    }).then(function (storedData) {
      const [version, codec, hash, size, digest] = storedData

      assert.equal(getCidv1FromBytes({ version, codec, hash, size, digest }), cidv1, "The cid doesn't match")
    })
  })

  // Test that owner of a feed publicly queryable
  it('should allow retrieval of the owner of the contract', function () {
    return OpenWit.deployed().then(function (instance) {
      openWitInstance = instance

      return openWitInstance.owner()
    }).then(function (owner) {
      assert.equal(accounts[0], owner)
    })
  })

  // IPFS hash update is limited only to the owner, as it is in effect the
  // add blog post function. Test that we revert IPFS hash updates from
  // users other than the owner.
  it('should revert an ipfs hash update from a non-owner account', function () {
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

  // Ownership transfer can only be instigated by the owner.
  // Test that we revert attempts at ownership transfer by
  // other users.
  it('should revert attempted ownership transfer', function () {
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

  // Test that an open wit contract can be destroyed
  it('should be destroyable by owner', function () {
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

contract('OpenWit - banned when paused', function (accounts) {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'

  // Test that an IPFS hash update cannot happen while the blog is locked/paused
  it('should revert attempted updates of the ipfs hash of the feed', async () => {
    const instance = await OpenWit.deployed()
    await instance.pause({ from: accounts[0] })

    try {
      const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

      await instance.setFeed(
        version,
        codec,
        hash,
        size,
        digest,
        { from: accounts[0] })
    } catch (err) {
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })

  // Test that a transfer of ownership is reverted while the blog is paused
  it('should revert attempted transfer of ownership', async () => {
    const instance = await OpenWit.deployed()
    // await instance.pause({ from: accounts[0] })

    try {
      await instance.transferOwnership(accounts[1], { from: accounts[0] })
    } catch (err) {
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })
})

contract('OpenWit - allowed when paused', function (accounts) {
  // Test that the blog can be destroyed EVEN when the blog is paused
  it('should be destroyable by owner', async () => {
    const instance = await OpenWit.deployed()
    await instance.pause({ from: accounts[0] })

    await instance.destroy({ from: accounts[0], gas: 300000 })

    try {
      await instance.owner()
    } catch (err) {
      assert.isTrue(/is not a contract address/.test(err.message))
      return
    }

    assert.fail()
  })
})
