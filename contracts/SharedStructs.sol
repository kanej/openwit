pragma solidity ^0.4.24;

library SharedStructs {

  // The state a Code of Conduct review can have.
  // It can be requested onchain, then the 
  // offline oracle service either passes or fails
  // the blog based on the rules of the Code of Conduct.
  enum RequestState { Requested, Passed, Failed }

  // A struct representing a 
  // Code of Conduct review request
  struct FeedCheckRequest {
    uint256 requestNo;
    address contractAddress;
    address requester;
    address requestingRegistry;
    RequestState state;
    uint256 blocknumber;
  }
}
