const OpenWitRegistry = artifacts.require('./OpenWitRegistry.sol')
const OpenWit = artifacts.require('./OpenWit.sol')

const { getBytesFromCidv1, getCidv1FromBytes } = require('../src/multihash')

contract('OpenWitRegistry', (accounts) => {
  const cidv1 = 'zdpuAx8dA7mPWu91KixgDtBa5qH496iW6vmJzVpJqSKkgquoB'
  const { version, codec, hash, size, digest } = getBytesFromCidv1(cidv1)

  it('should allow new feeds to be created', async () => {
    const registry = await OpenWitRegistry.deployed()

    const result = await registry.create(
      version,
      codec,
      hash,
      size,
      digest,
      {
        from: accounts[0],
        value: 100
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
    assert.equal(accounts[0], owner)
  })

  it('should make available the feed list', async () => {
    const registry = await OpenWitRegistry.deployed()

    const feeds = await registry.getAllFeeds.call()
    assert.isNotNull(feeds)
    assert.isTrue(feeds.length > 0)
  })

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
          value: 99
        })
    } catch (err) {
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })
})
