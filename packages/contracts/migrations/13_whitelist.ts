module.exports = (deployer: any, network: string, accounts: string[]) => {
  const Whitelist = artifacts.require("Whitelist");

  deployer.then(async () => {
    await deployer.deploy(Whitelist);
  });
};
