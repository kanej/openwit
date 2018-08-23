var OpenWitRegistry = artifacts.require('./OpenWitRegistry.sol')

module.exports = function (deployer) {
  deployer.deploy(OpenWitRegistry)
}
