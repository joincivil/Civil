module.exports = (deployer: any, network: string, accounts: string[]) => {
  const NewsroomFactory = artifacts.require("NewsroomFactory");
  const UserGroups = artifacts.require("UserGroups");
  const CreateNewsroomInGroup = artifacts.require("CreateNewsroomInGroup");

  deployer.then(async () => {
    await deployer.deploy(CreateNewsroomInGroup, NewsroomFactory.address, UserGroups.address);
  });
};
