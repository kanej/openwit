pragma solidity ^0.4.24;

import "./SharedStructs.sol";
import "./OpenWit.sol";
import "./OpenWitOracle.sol";

/**
 * @title OpenWitRegistry
 * @dev This contract creates an OpenWit community of microblogs
 * and controls its governance.
 */
contract OpenWitRegistry  {

  address feedCheckOracleAddress;

  constructor(address oracleAddress) public {
    feedCheckOracleAddress = oracleAddress;
  }

  enum FeedState {
    Nonexistant,
    GoodStanding,
    UnderReview,
    Banned
  }

  address[] public feeds;
  mapping(address => FeedState) public feedStates;

  event FeedCreated(
    address indexed newAddress,
    address indexed owner
  );

  event FeedReviewRequested(
    uint256 indexed requestNo,
    address indexed feedAddres,
    address indexed requester
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
    
    OpenWit feed = OpenWit(feedAddress);
    feed.setFeed(version, codec, hash, size, digest);
    feed.transferOwnership(msg.sender);

    feeds.push(feedAddress);
    feedStates[feedAddress] = FeedState.GoodStanding;

    emit FeedCreated(feedAddress, msg.sender);

    return feedAddress;
  }

  function requestConductCheck(address feedAddress)
  public
  {
    // Ignore feeds not in the registry, and revert if already banned
    require(feedStates[feedAddress] == FeedState.GoodStanding, "Feed not in registry or not in goodstanding");

    OpenWitOracle oracle = OpenWitOracle(feedCheckOracleAddress);
    feedStates[feedAddress] = FeedState.UnderReview;
    uint256 requestNo = oracle.requestFeedCheck(feedAddress, msg.sender, this);

    emit FeedReviewRequested(requestNo, feedAddress, msg.sender);
  }

  function updateFeedStateBasedOnConductCheck(uint requestNo)
  public
  {
    OpenWitOracle oracle = OpenWitOracle(feedCheckOracleAddress);

    (
      ,
      address feedAddress,
      ,
      ,
      SharedStructs.RequestState checkState,
      uint256 blocknumber
    ) = oracle.requests(requestNo);

    require(feedStates[feedAddress] == FeedState.UnderReview, "Only under review requests can be processed");

    if (checkState == SharedStructs.RequestState.Passed) {
      feedStates[feedAddress] = FeedState.GoodStanding;
    } else if (checkState == SharedStructs.RequestState.Failed) {
      feedStates[feedAddress] = FeedState.Banned;
    } else if (checkState == SharedStructs.RequestState.Requested) {
      require(block.number > blocknumber + 240, "Still within time window for oracle to reply");
      feedStates[feedAddress] = FeedState.GoodStanding;
    } else {
      revert("Unexpected request state");
    }
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
