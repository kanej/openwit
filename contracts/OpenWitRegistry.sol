pragma solidity ^0.4.24;

import './OpenWit.sol';

contract OpenWitRegistry  {
    address[] public feeds;

    event FeedCreated(
        address indexed newAddress,
        address indexed owner
    );

    modifier meetsStake() {
        require(msg.value >= 100);
        _;
    }

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

    function getAllFeeds()
    public
    view
    returns (address[])
    {
        return feeds;
    }
}
