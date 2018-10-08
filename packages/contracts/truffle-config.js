module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "build/migrations",
  test_directory: "build/test",
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
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
        var infuraProvider = require("@joincivil/dev-utils").infuraProvider;
        var mnemonic = process.env.MNEMONIC;
        var infura_key = process.env.INFURA_KEY;
        // HDWalletProvider doesn't support signing transactions which is nessecary for group creation
        return infuraProvider(mnemonic, "https://rinkeby.infura.io/" + infura_key);
      },
      network_id: 4,
      gasPrice: "20000000000",
    },
  },
  mocha: {
    bail: true,
  },
};
