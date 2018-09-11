module.exports = (deployer: any, network: string, accounts: string[]) => {
  const UserGroups = artifacts.require("UserGroups");
  const TokenController = artifacts.require("GroupTokenController");

  deployer.then(async () => {
    deployer.deploy(TokenController, UserGroups.address);
  });
};
