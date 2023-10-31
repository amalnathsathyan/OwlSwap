const hre = require("hardhat");

async function main() {
  const OwlSwap = await hre.ethers.getContractFactory("OwlSwap");
  const owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
  await owlSwap.waitForDeployment();
  console.log("OwlSwap deployed at:", await owlSwap.getAddress());
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});