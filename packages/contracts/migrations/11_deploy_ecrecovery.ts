module.exports = (deployer: any, network: string, accounts: string[]) => {
  const ECRecovery = artifacts.require("ECRecovery");
  const Newsroom = artifacts.require("Newsroom");

  deployer.then(async () => {
    await deployer.deploy(ECRecovery);
    await deployer.link(ECRecovery, Newsroom);
  });
};
