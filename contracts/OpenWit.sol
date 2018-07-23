pragma solidity ^0.4.18;

contract OpenWit {
  
  struct Multihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
  }

  event FeedUpdate(
    address indexed key,
    bytes32 digest,
    uint8 hashFunction,
    uint8 size
  );

  address owner;
  Multihash feed;

  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Update the IPFS multihash representing the feed
   * @param _digest hash digest produced by hashing content using hash function
   * @param _hashFunction hashFunction code for the hash function used
   * @param _size length of the digest
   */
  //function setFeed(bytes32 _digest, uint8 _hashFunction, uint8 _size)
  function setFeed(bytes32 _digest, uint8 _hashFunction, uint8 _size)
  public
  {
    feed = Multihash(_digest, _hashFunction, _size);
    emit FeedUpdate(
      msg.sender, 
      _digest, 
      _hashFunction, 
      _size
    );
  }

  /**
   * @dev retrieve multihash associated with the feed
   */
  function getFeed()
  public
  view
  returns(bytes32 digest, uint8 hashfunction, uint8 size)
  {
    Multihash storage entry = feed;
    return (entry.digest, entry.hashFunction, entry.size);
  }
}
