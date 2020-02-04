const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

console.log("INIT_CWD", __dirname);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "build/migrations",
  test_directory: "build/test",
  contracts_build_directory: path.join(__dirname, process.env.CONTRACT_BUILDS_DIRECTORY || "./build/contracts"),
  compilers: {
    solc: {
      version: "0.4.24",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },

  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "50",
    },
    rinkeby: {
      provider: function() {
        const mnemonic = process.env.MNEMONIC;
        const infura_key = process.env.INFURA_KEY;
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + infura_key);
      },
      network_id: 4,
    },
    ropsten: {
      provider: function() {
        const mnemonic = process.env.MNEMONIC;
        const infura_key = process.env.INFURA_KEY;
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + infura_key);
      },
      network_id: 5,
    },
    mainnet: {
      provider: function() {
        const mnemonic = process.env.MNEMONIC;
        const infura_key = process.env.INFURA_KEY;
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/" + infura_key);
      },
      network_id: 1,
    },
  },
  mocha: {
    bail: true,
  },
};
