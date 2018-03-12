module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "build/migrations",
  test_directory: "build/test",
  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "50"
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      from: "0x56078da599a095b42806b4037fb7f682ba0dce52",
      network_id: 4,
      gas: "7025901",
      gasPrice: "10000000000"
    }
  }
};
