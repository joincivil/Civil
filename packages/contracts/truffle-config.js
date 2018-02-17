module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  migrations_directory: "build/migrations",
  test_directory: "build/test",
  mocha: {
    reporter: 'mocha-multi-reporters',
    reporterOptions: {
      reporterEnabled: "mocha-junit-reporter, spec",
      mochaJunitReporterReporterOptions: {
        mochaFile: './build/junit/junit.xml'
      }
    }
  },
  networks: {
    development: {
    host: "localhost",
    port: 8545,
    network_id: "*" // Match any network id
   },
   develop: {
    host: "localhost",
    port: 9545,
    network_id: "*" // Match any network id
   }
  }
};
