const ethers = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const flashLoanAddress = '';
const flashLoanAbi = require('../artifacts/contracts/SimpleFlashloan.sol/SimpleFlashLoan.json');
const provider = new ethers.JsonRpcProvider(process.env.IFURA_ARB_MAINNET_URL);
const flashLoan = new ethers.Contract(flashLoanAddress, flashLoanAbi.abi, provider);
const { priceFetch } = require('./priceFetch.js');

const executeFlashloan = async () => {
  const { sellDex, buyDex, profit } = await priceFetch();
  if (profit > 0) {
    try {
      console.log('SellDex', sellDex, 'BuyDex', buyDex, 'Profit', profit);
      //await flashLoan.executeFunction();
      //execute flashloan
    } catch (error) {
      console.log(error);
    }
  }
};

executeFlashloan()
