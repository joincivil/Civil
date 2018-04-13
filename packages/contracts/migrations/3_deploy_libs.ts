/* global artifacts */

const DLL = artifacts.require("DLL");
const AttributeStore = artifacts.require("AttributeStore");

module.exports = (deployer: any) => {
  deployer.then(async () => {
    await deployer.deploy(DLL);
    await deployer.deploy(AttributeStore);
  });
};
