const { expect } = require("chai");
const { ethers } = require("hardhat");
const WETH9 = require('@aave/core-v3/artifacts/contracts/dependencies/weth/WETH9.sol/WETH9.json');
const IERC20 = require('@openzeppelin/contracts/build/contracts/IERC20.json')


describe('OwlSwap v1 Core Contract Unit Tests', function () {
  let signer;
  let signerAddr;
  let WETH;
  let deploymentAddr;
  let USDC;
  const wethAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
  const usdcAddress = '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a'; //GMX
  
  before("Getting signers and loading WETH contract", async () => {
    [signer] = await ethers.getSigners();
    WETH = await ethers.getContractAt(WETH9.abi, wethAddress, signer);
    USDC = await ethers.getContractAt(IERC20.abi, usdcAddress, signer);
    signerAddr = await signer.getAddress();
  })
  it("Deploy OwlSwap Contract", async function () {
    const OwlSwap = await ethers.getContractFactory("OwlSwap");
    const owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
    await owlSwap.waitForDeployment();
    deploymentAddr = await owlSwap.getAddress();
    expect(deploymentAddr).is.not.null;
    console.log("OwlSwap deployed at:", deploymentAddr);
  })
  it("Wrap ETH to WETH", async () => {
    await WETH.deposit({ value: ethers.parseEther('0.5') });
    expect(await WETH.balanceOf(await signer.getAddress()));
    console.log(`Successfully wrapped 100 ETH to 100 WETH`)
  })
  it("Send WETH to OwlSwap Contract", async () => {
    const tx = await WETH.transfer(deploymentAddr, ethers.parseEther('0.5'));
    await expect(tx).to.emit(WETH, "Transfer");
    console.log(`WETH transfer succeeded with tx hash: ${tx.hash}`)
  })
  
  it("Execute Flashloan arbitrage between Uniswap and TraderJoe", async () => {
    const owlSwap = await ethers.getContractAt('OwlSwap', deploymentAddr, signer);
    const initialWethBalance = await WETH.balanceOf(deploymentAddr);
    console.log(`Initial WETH Balance in OwlSwap Contract: ${initialWethBalance}`)
    expect(initialWethBalance).to.equal(ethers.parseEther('0.5'))
    console.log(`The OwlSwap contract has ${await WETH.balanceOf(deploymentAddr)} wei and approval is pending to execute flashloan`);
    const flashArbTx = await owlSwap.fn_RequestFlashLoan(wethAddress, ethers.parseEther('1.5'));
    expect(flashArbTx).to.emit(owlSwap,'FirstSwap');
    expect(flashArbTx).to.emit(owlSwap,'TraderJoe');
    console.log('First Swap success On Uniswap')
    expect(flashArbTx).to.emit(owlSwap,'SecondSwap');
    console.log('Second Swap success On TraderJoe')
    console.log(`OwlSwap flashloan arbitrage tx Succeeds with hash: ${flashArbTx.hash} and the log: ${await flashArbTx}`);
    const finalWethBalance = await WETH.balanceOf(deploymentAddr);
    console.log(`Final WETH Balance: ${finalWethBalance}`);
    const finalArbBalance = await USDC.balanceOf(deploymentAddr);
    console.log(`Final GMX balance: ${finalArbBalance}`)
    console.log(`Profit:${finalWethBalance-initialWethBalance}`);
    console.log('Thanks Using OwlSwap')
  })

  // it("Check TraderJoe Swap", async () => {
  //   const owlSwap = await ethers.getContractAt('OwlSwap', deploymentAddr, signer);
  //   const initialWethBalance = await WETH.balanceOf(deploymentAddr);
  //   const initialUsdcBalance = await USDC.balanceOf(deploymentAddr);
  //   console.log(`Initial WETH Balance in OwlSwap Contract: ${initialWethBalance}`);
  //   console.log(`Initial USDC Balance in OwlSwap Contract: ${initialUsdcBalance}`);
    
  //   //calling joeSwap
  //   const joeSwapTx = await owlSwap.joeSwap(wethAddress,usdcAddress,ethers.parseEther('0.1'))
  //   await expect(joeSwapTx).to.emit(WETH,'Approval');
  //   console.log(`Trader Joe Trade executed with hash: ${await joeSwapTx.hash}`);
    
  //   const finalWethBalance = await WETH.balanceOf(deploymentAddr);
  //   const finalUsdcBalance = await USDC.balanceOf(deploymentAddr);
  //   console.log(`Final WETH Balance in OwlSwap Contract: ${finalWethBalance}`);
  //   console.log(`Final USDC Balance in OwlSwap Contract: ${finalUsdcBalance}`);

  // })
})
