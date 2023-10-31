const hre = require("hardhat");
const {joeSwapAbi} = require('../artifacts/contracts/JoeSwap.sol/JoeSwap.json') ;

async function main() {
  const provider = hre.ethers.getDefaultProvider();

  const joeSwap = await hre.ethers.deployContract("JoeSwap");

  const JoeSwap = await joeSwap.waitForDeployment();

  const joeSwapDeploymentAddr = JoeSwap.getAddress();

  console.log(
    `JoeSwap deployed to :${joeSwapDeploymentAddr}`
  );
  
  transferEth(joeSwapDeploymentAddr);
  joeTrade('500000000000000',joeSwapDeploymentAddr);
}

const joeTrade = async (_amountIn,_address) => {
  const signer = await hre.ethers.getSigner();
  const abi = joeSwapAbi.abi;
  const joe = new hre.ethers.getContractAt(abi,_address,signer);
  const tx = await joe.joeSwap(_amountIn);
  console.log(`tx succeeded:${tx}`);
}

const transferEth = async (_addr) => {

  const signer = hre.ethers.getSigner();
  const tx = {
    to: _addr,
    value: hre.ethers.utils.parseEther('0.001', 'ether')
  };
  const transaction = await signer.sendTransaction(tx);
  console.log(`ETH transferred: ${transaction}`)
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
