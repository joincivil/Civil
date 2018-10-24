import { config } from "./utils";

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const DummyContributionProxy = artifacts.require("DummyContributionProxy");

  deployer.then(async () => {
    if (!config.nets[network] || !config.nets[network].TokenSaleAddress) {
      await deployer.deploy(DummyContributionProxy);
    }
  });
};
