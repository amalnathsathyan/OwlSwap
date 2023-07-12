const hre = require("hardhat");


async function main() {
  // Retrieve the signers (accounts) from Hardhat
  const [signers] = await hre.ethers.getSigners();

  // Deploy the Buy contract
  // const BuyLink = await hre.ethers.deployContract("BuyLink");
  // const buyLink = await BuyLink.waitForDeployment();

  // // Wait for the contract deployment to be confirmed
  // console.log(`The BuyLink contract is deployed to:,`, await buyLink.getAddress());

  // // Deploy the Sell contract
  // const SellLink = await hre.ethers.deployContract("SellLink");
  // const sellLink = await SellLink.waitForDeployment();

  // // Wait for the contract deployment to be confirmed
  // console.log(`The SellLink contract is deployed to:,`, await sellLink.getAddress());

  //

  const FlashLoan = await hre.ethers.deployContract("SimpleFlashLoan", ["0xC911B590248d127aD18546B186cC6B324e99F02c"]);
  const flashLoan = await FlashLoan.waitForDeployment();

  console.log("Flash Contract Deployed on :", await flashLoan.getAddress())


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
