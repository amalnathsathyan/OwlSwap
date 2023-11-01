const { expect } = require("chai");
const { ethers } = require("hardhat");
const WETH9 =require('@aave/core-v3/artifacts/contracts/dependencies/weth/WETH9.sol/WETH9.json')

describe("Testing OwlSwap v1 core contract", function () {
  let signer;
  let WETH;
  let deploymentAddr;
  let owlSwap;
  const wethAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
  before("Assigning signers and WETH contracts", async() => {
    [signer] = await ethers.getSigners();
    WETH = await ethers.getContractAt(WETH9.abi, wethAddress, signer);
  })
  it("deploys the owl contract", async function () {
    const OwlSwap = await ethers.getContractFactory("OwlSwap");
    owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
    await owlSwap.waitForDeployment();
    deploymentAddr = await owlSwap.getAddress();
    expect(deploymentAddr).is.not.null;
    console.log("OwlSwap deployed at:", deploymentAddr);
  })
  it("deposits ETH into WETH contract", async () => {
    await WETH.deposit({value:ethers.parseEther('0.01')});
    expect(await WETH.balanceOf(await signer.getAddress()));
  })
  it("sends WETH to the OwlSwap Contract that already have been deployed", async ()=>{
    const tx = await WETH.transfer(deploymentAddr,ethers.parseEther('0.01'));
    expect(tx).to.emit(WETH,"Transfer");
    console.log(`WETH transfer succeeded with tx hash: ${tx.hash} and recieved on address: ${tx.to}`)
  })
  it("Calls the flashloan function", async() => {
    const tx = await owlSwap.fn_RequestFlashLoan(wethAddress,ethers.parseEther('5'));
    expect(tx).emit(owlSwap,'FlashloanSucessFul');
    console.log(`FlashSwap Succeeds with hash: ${tx.hash} and address of the OwlSwap contract: ${tx.to}`)
  })
})

