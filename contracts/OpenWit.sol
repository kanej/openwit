pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

/**
 * @title OpenWit
 * @dev This contract owns and governs an OpenWit microblog, allowing
 * for updates against the blog and other administrative tasks.
 */
contract OpenWit is Destructible, Pausable {
  
  // An IPFS multihash in CID format
  struct Cid {
    uint8 version;
    uint8 codec;
    uint8 hashFunction;
    uint8 size;
    bytes32 digest;
  }

  // The event recorded on the update of the feeds
  // underlying data (as stored on IPFS)
  event FeedUpdate(
    address indexed key,
    uint8 version,
    uint8 codec,
    uint8 hashFunction,
    uint8 size,
    bytes32 digest
  );

  // The pointer the feeds data as an IPFS multihash
  Cid feed;

  /**
   * @dev Update the IPFS multihash (in cid format) representing the feed's data.
   * See https://github.com/ipld/cid for the spec of the format.
   * @param version the cid version
   * @param codec the cid codec e.g. cbor
   * @param hash the cid hashFunction code for the hash function used
   * @param size the cid length of the digest
   * @param digest the cid hash digest produced by hashing content using hash function
   */
  function setFeed(uint8 version, uint8 codec, uint8 hash, uint8 size, bytes32 digest)
  public
  onlyOwner
  whenNotPaused
  {
    feed = Cid(version, codec, hash, size, digest);
    emit FeedUpdate(
      msg.sender,
      version,
      codec,
      hash, 
      size, 
      digest
    );
  }

  /**
   * @dev retrieve IPFS multihash  representing the feed's data
   * @return the multihash as its constituent CID parts
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
