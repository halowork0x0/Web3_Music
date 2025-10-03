const { ethers } = require("hardhat")

async function main() {
    console.log('start deploy===')
    const mytokenFactory = await ethers.getContractFactory('WMCToken');
    const mytoken = await mytokenFactory.deploy("0xe2951bd1eD4269b167F602C745c31BEC198DcF49");
    await mytoken.waitForDeployment();
    console.log("contract deployed success, address is:", mytoken.target)

    if (hre.network.config.chainId == 11155111 && process.env.ETHERS_APIKEY) {
        console.log("contract is verifying to etherscan..");
        await mytoken.deploymentTransaction().wait(3);
        await verifyContractFn(mytoken.target, ["0xe2951bd1eD4269b167F602C745c31BEC198DcF49"]);
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