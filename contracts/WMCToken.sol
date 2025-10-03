// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract WMCToken is ERC20, Ownable, ERC20Permit {
    mapping(address => uint256) private lastFaucetTimes;

    constructor(address initialOwner)
        ERC20("Web3MusicToken", "WMC")
        Ownable(initialOwner)
        ERC20Permit("Web3MusicToken")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function claimFaucet() public faucetCooltimeClose {
        _mint(msg.sender, 500 * 10 ** decimals());
        setAccountMintFaucetTime(msg.sender);
    }

    function setAccountMintFaucetTime(address addr) public {
        lastFaucetTimes[addr] = block.timestamp;
    }

    function getAccountLastFaucetTime(address addr) view public returns(uint256) {
        return lastFaucetTimes[addr];
    }

    function getTimestamp() public view returns(uint256) {
        return block.timestamp;
    }

    modifier faucetCooltimeClose() {
        require((block.timestamp - getAccountLastFaucetTime(msg.sender)) > 60 * 60 * 24, "it's in cool time");
        _;
    }
}