import { config } from "./utils";

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const DummyTokenSale = artifacts.require("DummyTokenSale");

  deployer.then(async () => {
    if (!config.nets[network] || !config.nets[network].TokenSaleAddress) {
      console.log("Deploying Dummy Token Sale");
      await deployer.deploy(DummyTokenSale, 1);
    }
  });
};
