const path = require("path");
async function ledgerEthereumNodeJsClientFactoryAsync() {
  const Eth = require("@ledgerhq/hw-app-eth").default;
  const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
  const ledgerConnection = await TransportNodeHid.create();
  const ledgerEthClient = new Eth(ledgerConnection);
  return ledgerEthClient;
}

console.log("INIT_CWD", __dirname);

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "build/migrations",
  test_directory: "build/test",
  contracts_build_directory: path.join(__dirname, process.env.CONTRACT_BUILDS_DIRECTORY || "./build/contracts"),
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
        var infuraProvider = require("@joincivil/dev-utils").mnemonicProvider;
        var mnemonic = process.env.MNEMONIC;
        var infura_key = process.env.INFURA_KEY;
        // HDWalletProvider doesn't support signing transactions which is necessary for group creation
        return infuraProvider(mnemonic, "https://rinkeby.infura.io/" + infura_key);
      },
      network_id: 4,
      gasPrice: "20000000000",
    },
    ropsten: {
      provider: function() {
        var infuraProvider = require("@joincivil/dev-utils").mnemonicProvider;
        var mnemonic = process.env.MNEMONIC;
        var infura_key = process.env.INFURA_KEY;
        // HDWalletProvider doesn't support signing transactions which is nessecary for group creation
        return infuraProvider(mnemonic, "https://ropsten.infura.io/" + infura_key);
      },
      network_id: 5,
      gasPrice: "20000000000",
    },
    ledgerMainnet: {
      provider: function() {
        var ledgerProvider = require("@joincivil/dev-utils").ledgerProvider;
        var infura_key = process.env.INFURA_KEY;
        var accountId = +process.env.LEDGER_ACCOUNT_ID;
        return ledgerProvider({
          endpoint: "https://mainnet.infura.io/v3/" + infura_key,
          networkId: 1,
          accountId,
          ledgerEthereumClientFactoryAsync: ledgerEthereumNodeJsClientFactoryAsync,
        });
      },
      network_id: 1,
      gasPrice: "10000000000",
    },
  },
  mocha: {
    bail: true,
  },
};
