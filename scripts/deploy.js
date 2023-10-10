const hre = require("hardhat");

async function main() {
  const joeSwap = await hre.ethers.getContractFactory("JoeSwap");
  const JoeSwap = joeSwap.deploy();
  
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });