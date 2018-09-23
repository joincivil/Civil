module.exports = (deployer: any, network: string, accounts: string[]) => {
  const UnionFind = artifacts.require("UnionFind");
  const UserGroups = artifacts.require("UserGroups");
  const Whitelist = artifacts.require("Whitelist");

  deployer.then(async () => {
    await deployer.deploy(UnionFind);
    await deployer.link(UnionFind, UserGroups);
    await deployer.deploy(UserGroups, Whitelist.address);
  });
};
