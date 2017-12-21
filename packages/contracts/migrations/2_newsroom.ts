const Newsroom = artifacts.require("Newsroom");

export = (deployer: any) => {
  deployer.deploy(Newsroom);
};
