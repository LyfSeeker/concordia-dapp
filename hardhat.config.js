require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    opbnbTestnet: {
      url: "https://opbnb-testnet-rpc.bnbchain.org/",
      accounts: process.env.OPBNB_PRIVATE_KEY ? [process.env.OPBNB_PRIVATE_KEY] : [],
    },
  },
};
