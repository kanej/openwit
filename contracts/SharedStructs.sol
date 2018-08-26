pragma solidity ^0.4.24;

library SharedStructs {

    enum RequestState { Requested, Passed, Failed }

    struct FeedCheckRequest {
        uint256 requestNo;
        address contractAddress;
        address requester;
        address requestingRegistry;
        RequestState state;
        uint256 blocknumber;
    }
}
