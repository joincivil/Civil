import { config } from "./utils";

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const DummyContributionProxy = artifacts.require("DummyContributionProxy");
  const UserGroups = artifacts.require("UserGroups");
  const Whitelist = artifacts.require("Whitelist");

  deployer.then(async () => {
    let contributionsAddress: any = null;
    if (!config.nets[network] || !config.nets[network].ContributionProxyAddress) {
      console.log("Using Dummy Contribution Proxy for UserGroups");
      contributionsAddress = DummyContributionProxy.address;
    } else {
      contributionsAddress = config.nets[network].TokenSaleAddress;
    }
    await deployer.deploy(UserGroups, Whitelist.address, contributionsAddress);
  });
};
