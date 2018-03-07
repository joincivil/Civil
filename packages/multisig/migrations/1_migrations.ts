const Migrations = artifacts.require("./Migrations.sol");

export = (deployer: any) => {
  deployer.deploy(Migrations);
};
