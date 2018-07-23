var SimpleTwit = artifacts.require('./OpenWit.sol')

module.exports = function (deployer) {
  deployer.deploy(SimpleTwit)
}
