const { ethers } = require("hardhat")

const nftMetadataAry = [
  "https://continental-jade-wildcat.myfilebase.com/ipfs/QmeBPTuFdyyJweMhzZf5zWDFhwAnAagiBWYPo2ei5EqfWJ",
  "https://continental-jade-wildcat.myfilebase.com/ipfs/QmVE9eK8kFmEWf42ZM7WhpANCggPH33qDqmS48M3UwNQR2",
  "https://continental-jade-wildcat.myfilebase.com/ipfs/QmS9rGbLYj9XBfqjQXkUNLkBVXSDeancVUBYqB3HhHnwZj",
  "https://continental-jade-wildcat.myfilebase.com/ipfs/QmTN8LDryvc4xm1xSB9DT5AJbFw3hALP8v46huusttjYJs",
  "https://continental-jade-wildcat.myfilebase.com/ipfs/QmZQsWprECrNhbmGgSfEAXwNUjnFDtN4bUxTjcBtf8fdcg"
]

//MyNFT 合约构造函数传参: 1.initialOwner(合约owner)  2._tokenName(通证名字) 
// 3._tokenSymbol(通证简称) 4._metadata(nft元数据) 5._maxmintAmount(最多可mint数量, 当为0时无上限)
async function main() {
    console.log('start deploy===')
    const mynftFactory = await ethers.getContractFactory('MyNFT');
    const mynft = await mynftFactory.deploy("0xe2951bd1eD4269b167F602C745c31BEC198DcF49","MyNFT5","MT5",nftMetadataAry[4],50);
    await mynft.waitForDeployment();
    console.log("contract deployed success, address is:", mynft.target)

    if (hre.network.config.chainId == 11155111 && process.env.ETHERS_APIKEY) {
        console.log("contract is verifying to etherscan..");
        await mynft.deploymentTransaction().wait(3);
        await verifyContractFn(mynft.target, ["0xe2951bd1eD4269b167F602C745c31BEC198DcF49","MyNFT5","MT5",nftMetadataAry[4],50]);
        console.log("contract had success verify in etherscan");
    } else {
        console.log("verification skipped");
    }
}

async function verifyContractFn(contractAdr, params) {
    await hre.run("verify:verify", {
        address: contractAdr,
        constructorArguments: params,
    });
}

main().then().catch((error)=>{
    console.error(error);
    process.exit(1);
})