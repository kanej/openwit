pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

contract OpenWit is Destructible, Pausable {
  
  struct Cid {
    uint8 version;
    uint8 codec;
    uint8 hashFunction;
    uint8 size;
    bytes32 digest;
  }

  event FeedUpdate(
    address indexed key,
    uint8 version,
    uint8 codec,
    uint8 hashFunction,
    uint8 size,
    bytes32 digest
  );

  Cid feed;

  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Update the IPFS multihash representing the feed
   * @param _version the cid version
   * @param _codec the codec e.g. cbor
   * @param _hash hashFunction code for the hash function used
   * @param _size length of the digest
   * @param _digest hash digest produced by hashing content using hash function
   */
  function setFeed(uint8 _version, uint8 _codec, uint8 _hash, uint8 _size, bytes32 _digest)
  public
  onlyOwner
  whenNotPaused
  {
    feed = Cid(_version, _codec, _hash, _size, _digest);
    emit FeedUpdate(
      msg.sender,
      _version,
      _codec,
      _hash, 
      _size, 
      _digest
    );
  }

  /**
   * @dev retrieve multihash associated with the feed
   */
  function getFeed()
  public
  view
  returns(uint8 version, uint8 codec, uint8 hash, uint8 size, bytes32 digest)
  {
    Cid storage entry = feed;
    return (entry.version, entry.codec, entry.hashFunction, entry.size, entry.digest);
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   */
  function renounceOwnership()
  public
  onlyOwner
  whenNotPaused
  {
    super.renounceOwnership();
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner)
  public
  onlyOwner
  whenNotPaused
  {
    super.transferOwnership(_newOwner);
  }
}
