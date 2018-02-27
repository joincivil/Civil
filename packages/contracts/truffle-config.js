module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "build/migrations",
  test_directory: "build/test",
  networks: {
    develop: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    }
  }
};
