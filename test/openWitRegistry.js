const OpenWitRegistry = artifacts.require('./OpenWitRegistry.sol')
const OpenWitOracle = artifacts.require('./OpenWitOracle.sol')
const OpenWit = artifacts.require('./OpenWit.sol')

const { getBytesFromCidv1, getCidv1FromBytes } = require('../src/multihash')

contract('OpenWitRegistry - create new blogs', (accounts) => {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

  // Test that a feed can be created through the registry,
  // and that the owner is the caller of the registry.create
  // function
  it('should allow new feeds to be created', async () => {
    const registry = await OpenWitRegistry.deployed()

    const result = await registry.create(
      version,
      codec,
      hash,
      size,
      digest,
      {
        from: accounts[5],
        value: web3.toWei(0.1, 'ether')
      })

    const newFeedAddress = result.logs[0].args.newAddress

    const feedContract = await OpenWit.at(newFeedAddress)
    const [retrievedVersion, retrievedCodec, retrievedHash, retrievedSize, retrievedDigest] = await feedContract.getFeed.call()
    const ipfsHash = getCidv1FromBytes({
      version: retrievedVersion,
      codec: retrievedCodec,
      hash: retrievedHash,
      size: retrievedSize,
      digest: retrievedDigest
    })

    assert.equal(cidv1, ipfsHash, "The cid doesn't match")

    const owner = await feedContract.owner.call()
    assert.equal(accounts[5], owner)
  })

  // The list of feed should be publicly available
  it('should make available the feed list', async () => {
    const registry = await OpenWitRegistry.deployed()

    const feeds = await registry.getAllFeeds.call()
    assert.isNotNull(feeds)
    assert.isTrue(feeds.length > 0)
  })

  // There is a minimum stake for creating a blog in a registry.
  // Test that the create will be reverted if the user is short of the stake.
  it('should stop a new feed being created if the stake is not met', async () => {
    const registry = await OpenWitRegistry.deployed()

    try {
      await registry.create(
        version,
        codec,
        hash,
        size,
        digest,
        {
          from: accounts[0],
          value: web3.toWei(0.099, 'ether')
        })
    } catch (err) {
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })
})

contract('OpenWitRegistry - Code of Conduct Review', (accounts) => {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

  const REQUESTED = 0
  const PASSED = 1
  const FAILED = 2

  // Test that a code of conduct review is correctly recorded in
  // the registry
  it('should allow code of conduct review to be requested', async () => {
    const registry = await OpenWitRegistry.deployed()
    // Arrange

    // Setup a blog on the registry
    const result = await registry.create(
      version,
      codec,
      hash,
      size,
      digest,
      {
        from: accounts[5],
        value: web3.toWei(0.1, 'ether')
      })

    const newFeedAddress = result.logs[0].args.newAddress

    // Act
    const requestConductResult = await registry.requestConductCheck(
      newFeedAddress,
      {
        from: accounts[5]
      })

    const {requestNo, feedAddress, requester} = requestConductResult.logs[0].args

    assert.equal(1, requestNo)
    assert.equal(newFeedAddress, feedAddress)
    assert.equal(accounts[5], requester)

    const newFeedState = await registry.feedStates.call(newFeedAddress)

    assert.equal(2 /* UnderReview */, newFeedState)
  })

  // Test the complete path of a Code of Conduct review
  // leading up to the blog passing it
  it('should allow code of conduct review to be passed', async () => {
    const registry = await OpenWitRegistry.deployed()
    const oracle = await OpenWitOracle.deployed()
    // Arrange

    // Setup a blog on the registry
    const result = await registry.create(
      version,
      codec,
      hash,
      size,
      digest,
      {
        from: accounts[5],
        value: web3.toWei(0.1, 'ether')
      })

    const newFeedAddress = result.logs[0].args.newAddress

    // Request Code of Conduct review
    const requestConductResult = await registry.requestConductCheck(
      newFeedAddress,
      {
        from: accounts[5]
      })

    const {requestNo} = requestConductResult.logs[0].args

    // Pass the review
    await oracle.answerFeedCheck(requestNo, PASSED, {from: accounts[0]})

    // Act
    await registry.updateFeedStateBasedOnConductCheck(requestNo)

    const newFeedState = await registry.feedStates.call(newFeedAddress)

    assert.equal(1 /* Good Standing */, newFeedState)
  })

  // Test the complete path of a Code of Conduct review
  // leading up to the blog failing it
  it('should allow code of conduct review to be failed', async () => {
    const registry = await OpenWitRegistry.deployed()
    const oracle = await OpenWitOracle.deployed()
    // Arrange

    // Setup a blog on the registry
    const result = await registry.create(
      version,
      codec,
      hash,
      size,
      digest,
      {
        from: accounts[5],
        value: web3.toWei(0.1, 'ether')
      })

    const newFeedAddress = result.logs[0].args.newAddress

    // Request Code of Conduct review
    const requestConductResult = await registry.requestConductCheck(
      newFeedAddress,
      {
        from: accounts[5]
      })

    const {requestNo} = requestConductResult.logs[0].args

    // Pass the review
    await oracle.answerFeedCheck(requestNo, FAILED, {from: accounts[0]})

    // Act
    await registry.updateFeedStateBasedOnConductCheck(requestNo)

    const newFeedState = await registry.feedStates.call(newFeedAddress)

    assert.equal(3 /* Banned */, newFeedState)
  })
})
