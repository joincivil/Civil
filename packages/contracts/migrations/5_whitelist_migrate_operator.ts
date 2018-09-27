module.exports = (deployer: any, network: string, accounts: string[]) => {
  const Whitelist = artifacts.require("Whitelist");

  deployer.then(async () => {
    const whitelist = await Whitelist.deployed();
    await whitelist.addAddressToWhitelist(accounts[0]);
  });
};
