module.exports = (deployer: any, network: string, accounts: string[]) => {
  const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");

  deployer.deploy(MultiSigWalletFactory);
};
