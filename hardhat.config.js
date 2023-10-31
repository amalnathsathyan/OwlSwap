require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-solhint");
const dotenv = require('dotenv');
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
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
  // networks: {
  //   hardhat: {
  //     forking: {
  //       url: process.env.IFURA_ARB_GOERLI_URL
  //     }
  //   },
  // },

  networks: {
    hardhat: {
      forking: {
        url: process.env.IFURA_ARB_MAINNET_URL,
        accounts: [process.env.PRIVATE_KEY],
        blockNumber:145688281
      }
    },
    arbitrum: {
        url: process.env.IFURA_ARB_MAINNET_URL,
        accounts: [process.env.PRIVATE_KEY],
      }
    },
  mocha:{
    timeout:600000
  }
  }