module.exports = (deployer: any, network: string, accounts: string[]) => {
  const EventStorage = artifacts.require("EventStorage");
  deployer.then(async () => {
    await deployer.deploy(EventStorage);
  });
};
