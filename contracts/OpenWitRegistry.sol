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

  // The address of the oracle contract
  address feedCheckOracleAddress;

  /**
   * @dev the construct for the registry, requiring the specification of
   * the address of the oracle to be used
   * @param oracleAddress the address of the oracle to be used for conduct checks
   */
  constructor(address oracleAddress) public {
    feedCheckOracleAddress = oracleAddress;
  }

  // A feed has a state with regards to the registry.
  // It is initially in Good Standing but on a review being triggered
  // it will move to UnderReview. The review will either take
  // it back to Good Standing or lead to it being Banned
  enum FeedState {
    Nonexistant,
    GoodStanding,
    UnderReview,
    Banned
  }

  // The addresses of the blogs that make up the community
  address[] public feeds;

  // A mapping that associates a FeedState
  // with each blog in the registry
  mapping(address => FeedState) public feedStates;

  // The event recorded on a new blog being created through
  // the registry
  event FeedCreated(
    address indexed newAddress,
    address indexed owner
  );

  // The event recorded on a new Code of Conduct review
  // being requested on a blog through the registry
  event FeedReviewRequested(
    uint256 indexed requestNo,
    address indexed feedAddress,
    address indexed requester
  );

  // The event recorded when a stake burn fails
  // at the end of Code of Conduct review
  event StakeBurnFailure(
    uint256 indexed requestNo
  );

  /**
   * @dev Require the caller to be sending the minimum stake
   */
  modifier meetsStake() {
    require(msg.value >= 0.1 ether, "Does not meet the minimum stake");
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

  /**
   * @dev Request a review of specific OpenWit microblog by an oracle to determine
   * if it is meeing the rules of conduct.
   * @param feedAddress address of the blogs OpenWit contract
   */
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

  /**
   * @dev Resolve the state of a blog that is under code of conduct review, by
   * updating its state base on the result of the review by the oracle.
   * @param requestNo the number of the request as assigned by the oracle
   */
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

      // Burn the stake, ignore failure as we want the feed state
      // updated to banned anyway
      bool success = address(0).send(0.1 ether);

      if(!success) {
        emit StakeBurnFailure(requestNo);
      }
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
