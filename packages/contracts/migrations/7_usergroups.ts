import { config } from "./utils";

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const DummyTokenSale = artifacts.require("DummyTokenSale");
  const UserGroups = artifacts.require("UserGroups");
  const Whitelist = artifacts.require("Whitelist");

  deployer.then(async () => {
    let tokenSaleAddress: any = null;
    if (!config.nets[network] || !config.nets[network].TokenSaleAddress) {
      console.log("Using Dummy Token Sale for UserGroups");
      tokenSaleAddress = DummyTokenSale.address;
    } else {
      tokenSaleAddress = config.nets[network].TokenSaleAddress;
    }
    await deployer.deploy(UserGroups, Whitelist.address, tokenSaleAddress);
  });
};
