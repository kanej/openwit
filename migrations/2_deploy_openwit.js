var OpenWit = artifacts.require('./OpenWit.sol')
var OpenWitRegistry = artifacts.require('./OpenWitRegistry.sol')
var OpenWitOracle = artifacts.require('./OpenWitOracle.sol')
var SharedStructs = artifacts.require('./SharedStructs.sol')

module.exports = (deployer) => {
  return deployer.deploy(SharedStructs).then(() => {
    return deployer.deploy(OpenWitOracle)
  }).then(() => {
    return deployer.link(SharedStructs, OpenWitOracle)
  }).then(() => {
    return deployer.deploy(OpenWitRegistry, OpenWitOracle.address)
  }).then(() => {
    return deployer.link(SharedStructs, OpenWitRegistry)
  }).then(() => {
    return deployer.deploy(OpenWit)
  })
}
