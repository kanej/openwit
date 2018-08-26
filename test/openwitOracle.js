
const OpenWitOracle = artifacts.require('./OpenWitOracle.sol')

contract('OpenWitOracle - Requesting', (accounts) => {
  const exampleOpenWitContract = '0xaaad3a6d3569df655070ded06cb7a1b2ccd1d3af'
  const exampleRegistry = '0xbbbd3a6d3569df655070ded06cb7a1b2ccd1d3af'
  const exampleRequestingUser = accounts[1]

  it('should allow requesting the check of an OpenWit blog\'s feed', async () => {
    const oracle = await OpenWitOracle.deployed()

    const result = await oracle.requestFeedCheck(
      exampleOpenWitContract,
      exampleRequestingUser,
      exampleRegistry
    )

    const requestNumber = result.logs[0].args.requestNo

    const [
      requestNo,
      contractAddress,
      requester,
      requestingRegistry,
      state
    ] = await oracle.requests.call(requestNumber)

    assert.equal(requestNumber.toNumber(), requestNo.toNumber())
    assert.equal(exampleOpenWitContract, contractAddress, 'The OpenWit contract being checked has not come back')
    assert.equal(exampleRequestingUser, requester, 'The address of the requesting user has not been set')
    assert.equal(exampleRegistry, requestingRegistry, 'The address of the registry requesting the check has not been set')
    assert.equal(0, state.toNumber(), 'State should be Requested(0)')
  })
})

contract('OpenWitOracle - Answering', (accounts) => {
  const exampleOpenWitContract = '0xaaad3a6d3569df655070ded06cb7a1b2ccd1d3af'
  const exampleRegistry = '0xbbbd3a6d3569df655070ded06cb7a1b2ccd1d3af'
  const exampleRequestingUser = accounts[1]

  const REQUESTED = 0
  const PASSED = 1
  const FAILED = 2

  it('should allow answering the request with pass', async () => {
    const oracle = await OpenWitOracle.deployed()

    const requestResult = await oracle.requestFeedCheck(
      exampleOpenWitContract,
      exampleRequestingUser,
      exampleRegistry
    )

    const requestNumber = requestResult.logs[0].args.requestNo

    // Answer
    const answerResult = await oracle.answerFeedCheck(requestNumber, PASSED)

    const eventRequestNo = answerResult.logs[0].args.requestNo
    const eventState = answerResult.logs[0].args.state

    const [, , , , storedState] = await oracle.requests(requestNumber)

    assert.equal(requestNumber.toNumber(), eventRequestNo.toNumber())
    assert.equal(PASSED, eventState)

    assert.equal(PASSED, storedState)
  })

  it('should revert attempting to answer a request by setting the state to requested', async () => {
    // Arrange
    const oracle = await OpenWitOracle.deployed()

    const requestResult = await oracle.requestFeedCheck(
      exampleOpenWitContract,
      exampleRequestingUser,
      exampleRegistry
    )

    const requestNumber = requestResult.logs[0].args.requestNo

    try {
    // Act
      await oracle.answerFeedCheck(requestNumber, REQUESTED)
    } catch (err) {
      // Assert
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })

  it('should revert attempts to change the answer', async () => {
    const oracle = await OpenWitOracle.deployed()

    // Arrange
    const requestResult = await oracle.requestFeedCheck(
      exampleOpenWitContract,
      exampleRequestingUser,
      exampleRegistry
    )

    const requestNumber = requestResult.logs[0].args.requestNo

    await oracle.answerFeedCheck(requestNumber, FAILED)

    try {
      // Act
      await oracle.answerFeedCheck(requestNumber, PASSED)
    } catch (err) {
      // Assert
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })

  it('should revert attempts to answer a nonexistant request', async () => {
    const oracle = await OpenWitOracle.deployed()

    // Arrange
    const nonexistantRequest = 9999
    try {
      // Act
      await oracle.answerFeedCheck(nonexistantRequest, PASSED)
    } catch (err) {
      // Assert
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })
})

contract('OpenWitOracle - Circuit Breaker', (accounts) => {
  const exampleOpenWitContract = '0xaaad3a6d3569df655070ded06cb7a1b2ccd1d3af'
  const exampleRegistry = '0xbbbd3a6d3569df655070ded06cb7a1b2ccd1d3af'
  const exampleRequestingUser = accounts[9]

  it('should revert check requests while it is paused', async () => {
    const oracle = await OpenWitOracle.deployed()

    await oracle.pause({ from: accounts[0] })

    try {
      await oracle.requestFeedCheck(
        exampleOpenWitContract,
        exampleRequestingUser,
        exampleRegistry
      )
    } catch (err) {
      assert.isTrue(/revert/.test(err.message))
      return
    }

    assert.fail()
  })

  it('should accept check requests again when it is unpaused', async () => {
    const oracle = await OpenWitOracle.deployed()

    await oracle.unpause({ from: accounts[0] })

    try {
      await oracle.requestFeedCheck(
        exampleOpenWitContract,
        exampleRequestingUser,
        exampleRegistry
      )
    } catch (err) {
      assert.fail()
    }
  })
})
