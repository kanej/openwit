pragma solidity ^0.4.24;

import "./OpenWit.sol";

/**
 * @title OpenWitRegistry
 * @dev This contract creates an OpenWit community of microblogs
 * and controls its governance.
 */
contract OpenWitRegistry  {
  address[] public feeds;

  event FeedCreated(
    address indexed newAddress,
    address indexed owner
  );

  /**
   * @dev Require the caller to be sending the minimum stake
   */
  modifier meetsStake() {
    require(msg.value >= 100, "Does not meet the minimum stake");
    _;
  }

  /**
   * @dev Create a new OpenWit microblog associated with this registry.
   * The caller passes the IPFS hash (cid format) of the blogs data
   * for initialization.
   * @param version the cid version
   * @param codec the cid codec e.g. cbor
   * @param hash the cid hashFunction code for the hash function used
   * @param size the cid length of the digest
   * @param digest the cid hash digest produced by hashing content using hash function
   * @return the address of the new microblog's contract
   */
  function create(uint8 version, uint8 codec, uint8 hash, uint8 size, bytes32 digest)
  public 
  payable
  meetsStake
  returns (address)
  {
    address feedAddress = new OpenWit();
    feeds.push(feedAddress);
    emit FeedCreated(feedAddress, msg.sender);
    OpenWit feed = OpenWit(feedAddress);
    feed.setFeed(version, codec, hash, size, digest);
    feed.transferOwnership(msg.sender);
    return feedAddress;
  }

  /**
   * @dev Get the list of microblogs that are registered with this registry.
   * @return the addresses of the registered microblog contracts
   */
  function getAllFeeds()
  public
  view
  returns (address[])
  {
    return feeds;
  }
}
