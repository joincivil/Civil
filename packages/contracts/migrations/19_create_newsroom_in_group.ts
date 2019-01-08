module.exports = (deployer: any, network: string, accounts: string[]) => {
  const NewsroomFactory = artifacts.require("NewsroomFactory");
  const CreateNewsroomInGroup = artifacts.require("CreateNewsroomInGroup");
  const CivilTokenController = artifacts.require("CivilTokenController");

  deployer.then(async () => {
    await deployer.deploy(CreateNewsroomInGroup, NewsroomFactory.address, CivilTokenController.address);
  });
};
