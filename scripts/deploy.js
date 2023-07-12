const hre = require("hardhat");

async function main() {
  // Retrieve the signers (accounts) from Hardhat
  const [signers] = await hre.ethers.getSigners();

  // Deploy the SingleSwap contract
  const SingleSwap = await hre.ethers.deployContract("SingleSwap");
  const singleSwap = await SingleSwap.waitForDeployment();

  // Wait for the contract deployment to be confirmed

  console.log(`The SingleSwap contract is deployed to,`, singleSwap);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
