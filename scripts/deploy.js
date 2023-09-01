const hre = require("hardhat");

async function main() {

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


async function deploy() {
  const [signers] = await hre.ethers.getSigners(); 
  
  const FlashLoan = await hre.ethers.deployContract("SimpleFlashLoan", ["0xC911B590248d127aD18546B186cC6B324e99F02c"]);
  const flashLoan = await FlashLoan.waitForDeployment();

  console.log("Flash Contract Deployed on :", await flashLoan.getAddress())
}