require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{
      version: '0.7.6',
    },
    {
      version: '0.8.10'
    },
    {
      version: '0.8.0'
    },]
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.INFURA_GOERLI_ENDPOINT,
        accounts: [process.env.PRIVATE_KEY],
      }
    },
    goerli: {
      url: process.env.INFURA_GOERLI_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
};