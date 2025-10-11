// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MusicFund {
  
    AggregatorV3Interface public ehtUsdDataFeed;
    string public metadata_url;
    address private owner;
    mapping (address => uint256) public musicFund;
    uint256 public targetFund; //USD
    uint256 public minFund;    //USD
    uint256 public deployTimeStamp;
    uint256 public windowTimeStamp;

    constructor(address _address, uint256 _targetFund, uint256 _minFund, uint256 _windowTime, string memory _url) {
      ehtUsdDataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
      deployTimeStamp = block.timestamp;
      owner = _address;
      targetFund = _targetFund * 10 ** 18;
      minFund = _minFund * 10 ** 18;
      windowTimeStamp = _windowTime;
      metadata_url = _url;
    }

    function getMetadtaUrl() public view returns (string memory) {
        return metadata_url;
    }

    function showFundBalanceTotalUsd() public view returns (uint256) {
        return convertEthToUsd(address(this).balance);
    }

    function showFundBalanceTotalEth() public view returns (uint256) {
        return address(this).balance;
    }

    function resetWindowTimestamp(uint256 _windowTime) public {
        windowTimeStamp = _windowTime;
    }

    function fund() external payable {
      require(convertEthToUsd(msg.value)>minFund, "fund amount not reach minimum limit");
      require(block.timestamp < deployTimeStamp + windowTimeStamp, "the activity is closed");
      musicFund[msg.sender] += msg.value;
    }

    function getFund() external windowClosed onlyOwner {
        require(convertEthToUsd(address(this).balance) >= targetFund, "Target is not reached");
        bool success;
        uint256 balance = address(this).balance;
        (success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "transfer tx failed");
        musicFund[msg.sender] = 0;
    }

    function refund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < targetFund, "Target is reached");
        require(musicFund[msg.sender] != 0, "there is no fund for you");
        bool success;
        uint256 balance = musicFund[msg.sender];
        (success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "transfer tx failed");
        musicFund[msg.sender] = 0;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = ehtUsdDataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return ethAmount * ethPrice / (10 ** 8);
    }

    function getMusicMetadata() public view returns(string memory) {
      return metadata_url;
    }

    modifier windowClosed() {
      require(block.timestamp >= deployTimeStamp + windowTimeStamp, "it is in window time");
      _;
    }

    modifier onlyOwner() {
      require(msg.sender == owner, "you're not owner, couldn't call this function");
      _;
    }
}