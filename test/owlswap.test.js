const { expect } = require("chai");
const { ethers } = require("hardhat");
const WETH9 = require('@aave/core-v3/artifacts/contracts/dependencies/weth/WETH9.sol/WETH9.json')
// const OwlSwapContract = require('../artifacts/contracts/OwlSwap.sol/OwlSwap.json');

describe('Testing OwlSwapV1 core contract', function () {
  let signer;
  let signerAddr;
  let WETH;
  let deploymentAddr;
  const wethAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
  before("Getting signers and loading WETH contract", async () => {
    [signer] = await ethers.getSigners();
    WETH = await ethers.getContractAt(WETH9.abi, wethAddress, signer);
    signerAddr = await signer.getAddress();
  })
  it("Deploying the owl contract", async function () {
    const OwlSwap = await ethers.getContractFactory("OwlSwap");
    const owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
    await owlSwap.waitForDeployment();
    deploymentAddr = await owlSwap.getAddress();
    expect(deploymentAddr).is.not.null;
    console.log("OwlSwap deployed at:", deploymentAddr);
  })
  it("deposits ETH into WETH contract", async () => {
    await WETH.deposit({ value: ethers.parseEther('0.1') });
    expect(await WETH.balanceOf(await signer.getAddress()));
  })
  it("sends WETH to the OwlSwap Contract that already have been deployed", async () => {
    const tx = await WETH.transfer(deploymentAddr, ethers.parseEther('0.1'));
    await expect(tx).to.emit(WETH, "Transfer");
    console.log(`WETH transfer succeeded with tx hash: ${tx.hash}`)
  })
  it("Calls the flashloan function", async () => {
    const owlSwap = await ethers.getContractAt('OwlSwap', deploymentAddr, signer)
    expect(await WETH.balanceOf(deploymentAddr)).to.equal(ethers.parseEther('0.1'))
    console.log(`The OwlSwap contract has ${await WETH.balanceOf(deploymentAddr)} wei and approval is pending to execute flashloan`);
    const approvalTx = await WETH.approve(deploymentAddr, ethers.parseEther('0.1'));
    await expect(approvalTx).to.emit(WETH,"Approval");
    console.log(`Approval Succeeds with hash: ${approvalTx.hash}`)
    console.log(` New speniding limit for ${deploymentAddr} to spend ${await WETH.symbol()} is ${await WETH.allowance(signerAddr,deploymentAddr)}`);
    const tx = await owlSwap.fn_RequestFlashLoan(wethAddress, ethers.parseEther('0.05'));
    await expect(tx).to.emit(owlSwap,'FirstSwap');
    console.log('First Swap Done On Uniswap')
    await expect(tx).to.emit(owlSwap,'SecondSwap');
    console.log('Second Swap Done On Uniswap')
    await expect(tx).to.emit(owlSwap, 'FlashloanSucessFul');
    console.log(`FlashSwap Succeeds with hash: ${tx.hash} and address of the OwlSwap contract use for this loan: ${tx.to}`)
    console.log('Thanks Using OwlSwap')
  })
})

