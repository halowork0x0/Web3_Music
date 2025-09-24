require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();

const PRIVATE_ACCOUNT1 = process.env.PRIVATE_ACCOUNT1;
const PRIVATE_ACCOUNT2 = process.env.PRIVATE_ACCOUNT2;
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const ETHERS_APIKEY = process.env.ETHERS_APIKEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_ACCOUNT1, PRIVATE_ACCOUNT2],
      chainId: 11155111
    }
  },
  etherscan:{
    apiKey:{
      sepolia: ETHERS_APIKEY
    }
  },
};
