module.exports = (deployer: any, network: string, accounts: string[]) => {
  const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
  const NewsroomFactory = artifacts.require("NewsroomFactory");

  deployer.then(async () => {
    const multisigWalletFactory = await MultiSigWalletFactory.deployed();
    await deployer.deploy(NewsroomFactory, multisigWalletFactory.address);
  });
};
