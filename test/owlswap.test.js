const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Calling Flashloan and execute swaps", function () {

  it("deploys the owl contract", async function () {
    const OwlSwap = await ethers.getContractFactory("OwlSwap");
    const owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
    await owlSwap.waitForDeployment();
    const deploymentAddr = await owlSwap.getAddress();
    expect(deploymentAddr).is.not.null;
    console.log("OwlSwap deployed at:", deploymentAddr);
  })
})

