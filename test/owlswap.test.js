const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Calling Flashloan and execute swaps", function () {
  it("deploys the contract", async function () {
    const OwlSwap = await ethers.getContractFactory("OwlSwap");
    const owlSwap = await OwlSwap.deploy('0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb');
    await storage.deployed();
    console.log("OwlSwap deployed at:", owlSwap.address);
  });
//   it("test updating and retrieving updated value", async function () {
//     const Storage = await ethers.getContractFactory("Storage");
//     const storage = await Storage.deploy();
//     await storage.deployed();
//     const storage2 = await ethers.getContractAt("Storage", storage.address);
//     const setValue = await storage2.store(56);
//     await setValue.wait();
//     expect((await storage2.retrieve()).toNumber()).to.equal(56);
//   });
});
