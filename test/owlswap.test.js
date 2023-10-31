const { expect } = require("chai");
const { ethers } = require("hardhat");
const WETH9 =require('@aave/core-v3/artifacts/contracts/dependencies/weth/WETH9.sol/WETH9.json')

describe("Calling Flashloan and execute swaps", function () {

  it("deploys the owl contract", async function () {
    const OwlSwap = await ethers.getContractFactory("OwlSwap");
    const owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
    await owlSwap.waitForDeployment();
    const deploymentAddr = await owlSwap.getAddress();
    expect(deploymentAddr).is.not.null;
    console.log("OwlSwap deployed at:", deploymentAddr);
  })
  it("deposits ETH into WETH contract", async () => {
    const [signer] = await ethers.getSigners();
    const wethAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
    const WETH = await ethers.getContractAt(WETH9.abi, wethAddress, signer);
    await WETH.deposit({value:ethers.parseEther('0.01')});
    expect(await WETH.balanceOf(await signer.getAddress()));
  })
  it("sends WETH to the OwlSwap Contract that already have been deployed", async ()=>{
    console.log('Hi Vishnu')
  })
})

