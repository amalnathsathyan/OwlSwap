const hre = require("hardhat");

async function main() {
  deploySimpleFlashloan()
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


async function deploySimpleFlashloan() {
  console.log('preparing to deploy a SimpleFlashLoan contract')
  console.log('Getting signer using the provided address')
  const [signers] = await hre.ethers.getSigners();
  console.log('Current Signer:', signers[0], ',More Signers:', signers[1], signers[2])
  const FlashLoan = await hre.ethers.deployContract("SimpleFlashLoan", ["0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"], signers[0]);
  console.log('Deploying.....🧭🧭🧭🧭🧭')
  const flashLoan = await FlashLoan.waitForDeployment();
  console.log("Flash Contract Deployed on :", await flashLoan.getAddress())
}