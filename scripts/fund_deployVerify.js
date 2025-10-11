const { ethers } = require("hardhat")

async function main() {
    console.log('start deploy===')
    const oneDayTimestamp = 60 * 60 * 24;
    const metadataUrl = "https://continental-jade-wildcat.myfilebase.com/ipfs/QmSVN7XtcUPFYAZywbFWHWo1yZ38sJ6r8mcopBUxSax2mn";
    const fundFactory = await ethers.getContractFactory('MusicFund');
    const myFund = await fundFactory.deploy("0xe2951bd1eD4269b167F602C745c31BEC198DcF49",1600,20,oneDayTimestamp*23,metadataUrl);
    await myFund.waitForDeployment();
    console.log("contract deployed success, address is:", myFund.target)

    if (hre.network.config.chainId == 11155111 && process.env.ETHERS_APIKEY) {
        console.log("contract is verifying to etherscan..");
        await myFund.deploymentTransaction().wait(3);
        await verifyContractFn(myFund.target, ["0xe2951bd1eD4269b167F602C745c31BEC198DcF49",1600,20,oneDayTimestamp*23,metadataUrl]);
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