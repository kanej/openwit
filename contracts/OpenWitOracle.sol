pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./SharedStructs.sol";


/**
 * @title OpenWitOracle
 * @author kanej
 * @dev This contract allows onchain contracts to verify
 * whether the feed of an OpenWit blog contract meets the
 * Code of Conduct.
 */
contract OpenWitOracle is Ownable, Pausable {

  // An counter allowing the allocation of a incrementing
  // unique request number to each new request
  uint256 private RequestIndexCounter = 0;

  // The event recorded when the oracle is
  // requested to perform a Code of Conduct check
  event FeedCheckRequested(
    uint256 indexed requestNo,
    address contractAddress,
    address indexed requester,
    address indexed requestingRegistry
  );

  // The event recorded when the off chain oracle service
  // has answered the check either as a pass or fail
  event FeedCheckAnswered(
    uint256 indexed requestNo,
    SharedStructs.RequestState state
  );

  // The requests that have been made to the oracle which
  // also contains their state
  mapping(uint256 => SharedStructs.FeedCheckRequest) public requests;

  /**
   * @dev Request a Code of Conduct check on a blog by the off chain
   * oracle service. This can only be done in the context of a registry.
   * @param openWitContractAddress the address of the blog's OpenWit contract
   * @param requester the address of the account requesting the review
   * @param requestingRegistry the registry the blog is part of
   */
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

  /**
   * @dev Respond to a Code of Conduct request with either a pass or fail.
   * Only performable by the owner of the oracle, which the off chain oracle
   * service is assumed to be.
   * @param requestNo the number of the request being answered
   * @param state whether the blog passed or failed the review
   */
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
