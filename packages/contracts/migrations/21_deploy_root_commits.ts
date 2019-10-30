module.exports = (deployer: any, network: string, accounts: string[]) => {
  const RootCommits = artifacts.require("RootCommits");

  deployer.deploy(RootCommits);
};
