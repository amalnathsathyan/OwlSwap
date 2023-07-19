const { expect } = require('chai');
const { ethers, network } = require('hardhat');
const { utils } = require('ethers');
const SimpleFlashLoan = require('../artifacts/contracts/flashsellbuy.sol/SimpleFlashLoan.json');
const IERC20 = require('../artifacts/@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol/IERC20.json');
const IWETH9 = require('../artifacts/contracts/interfaces/IWETH9.sol/IWETH9.json');



const linkWhale = '0x991AA2FFD462E17ec48cd90071De58CB0406a998';
const LINK = '0xe9c4393a23246293a8D31BF7ab68c17d4CF90A29';
const WETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
const PROVIDER_ADDRESS = '0xC911B590248d127aD18546B186cC6B324e99F02c';
const flashContract = '0xC945a5A960FeF1A9C3fef8593FC2446d1D7c6146';

describe('Flash Sell Buy Contract On Goerli Fork', async function () {
    let link;
    let weth;
    let amount;

    let whale;
    
    before(async () => {
        await ethers.getSigners();
        await network.provider.request({
            method: 'hardhat_impersonateAccount',
            params: [linkWhale]
        });
        whale = await ethers.getSigner(linkWhale);
        console.log("Whale Address", whale)
        link = new ethers.Contract(LINK, IERC20.abi, whale);
        weth = new ethers.Contract(WETH, IWETH9.abi, whale);
        FlashContract = new ethers.Contract(flashContract, SimpleFlashLoan.abi, whale);
        await link.approve(flashContract, 100);

    });

    it("Whale transfers some link to the contract", async () => {
        // await link.transfer(flashContract, 10);
        // console.log('Link Transferred', await link.balanceOf(flashContract)); l
    })
    it("Requesting Flashloan", async () => {

    })
});
