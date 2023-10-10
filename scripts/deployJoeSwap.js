const hre = require("hardhat");

async function main() {
    const joeSwap = await hre.ethers.deployContract('JoeSwap');
    const contractAddress = await joeSwap.waitForDeployment();
    console.log(`joeswap deployed to:${await contractAddress.getAddress()}`);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
