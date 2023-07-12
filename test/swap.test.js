const { expect } = require('chai');
const { ethers } = require('hardhat');

const WETH9 = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const DAI = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1';

describe('Swap Demo1', function () {
  it('', async function () {
    console.log('Entering Test');
    const accounts = await ethers.getSigners();
    const dai = await ethers.getContractAt('IERC20', DAI);
    const weth9 = await ethers.getContractAt('IWETH9', WETH9);

    const simpleSwap = await ethers.getContractFactory('SimpleSwap');
    const SimpleSwap = await simpleSwap.deploy();
    await SimpleSwap.deployed();
    console.log('SimpleSwap Deployed to:', SimpleSwap.address);

    const amountIn = 10n ** 18n;

    await weth9.connect(accounts[0]).deposit({ value: amountIn });
    await weth9.connect(accounts[0]).approve(SimpleSwap.address, amountIn);

    await SimpleSwap.swapWETHForDAI(amountIn);
    console.log('DAI Balance:', await dai.balanceOf(accounts[0].address));
  });
});
