pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./SharedStructs.sol";


/**
 * @title OpenWitOracle
 * @dev This contract allows onchain contracts to verify
 * whether the feed of an OpenWit blog contract meets the
 * code of conduct.
 */
contract OpenWitOracle is Ownable, Pausable {

  uint RequestIndexCounter = 0;

  event FeedCheckRequested(
    uint256 indexed requestNo,
    address contractAddress,
    address indexed requester,
    address indexed requestingRegistry
  );

  event FeedCheckAnswered(
    uint256 indexed requestNo,
    SharedStructs.RequestState state
  );

  mapping(uint256 => SharedStructs.FeedCheckRequest) public requests;

  function requestFeedCheck(
    address openWitContractAddress,
    address requester,
    address requestingRegistry)
  public
  whenNotPaused
  returns(uint256)
  {
    uint256 requestNo = ++RequestIndexCounter;

    SharedStructs.FeedCheckRequest memory checkRequest = SharedStructs.FeedCheckRequest(
      requestNo,
      openWitContractAddress,
      requester,
      requestingRegistry,
      SharedStructs.RequestState.Requested,
      block.number);

    requests[requestNo] = checkRequest;

    emit FeedCheckRequested(
      requestNo,
      openWitContractAddress,
      requester,
      requestingRegistry);

    return requestNo;
  }

  function answerFeedCheck(uint256 requestNo, SharedStructs.RequestState state)
  public
  onlyOwner
  whenNotPaused
  {
    // Can't update state to requested
    require(state != SharedStructs.RequestState.Requested, "Can only pass or fail a request");

    SharedStructs.FeedCheckRequest memory request = requests[requestNo];
        
    // check request exists
    require(request.requestNo != 0 && request.contractAddress != address(0) && request.requester != address(0) && request.requestingRegistry != address(0), "The request did not exist");

    // check the request hasn't already been answered
    require(request.state == SharedStructs.RequestState.Requested, "Only unanswered requests can be updated");

    // Update the request in the Oracle
    request.state = state;
    requests[requestNo] = request;

    emit FeedCheckAnswered(requestNo, state);
  }
}
