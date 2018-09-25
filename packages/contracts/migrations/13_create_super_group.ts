/* global artifacts */
import { prepareForceUnionMessage, promisify } from "@joincivil/utils";
import { POU_SUPER_GROUP } from "../test/utils/constants";

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const [OPERATOR] = accounts;
  const signAsync = promisify<string>(web3.eth.sign, web3.eth);

  const CivilTCR = artifacts.require("CivilTCR");
  const Parameterizer = artifacts.require("CivilParameterizer");
  const PLCRVoting = artifacts.require("CivilPLCRVoting");
  const Government = artifacts.require("Government");
  const UserGroups = artifacts.require("UserGroups");

  deployer.then(async () => {
    const userGroups = await UserGroups.deployed();

    const union = async (addressA: string, addressB: string) => {
      const message = prepareForceUnionMessage(userGroups.address, addressA, addressB);
      const signature = await signAsync(OPERATOR, message);
      await userGroups.forceUnion(addressA, addressB, signature);
    };

    const parametizer = await Parameterizer.deployed();
    const civilTCR = await CivilTCR.deployed();
    const plcrVoting = await PLCRVoting.deployed();
    const government = await Government.deployed();

    await union(parametizer.address, civilTCR.address);
    await union(plcrVoting.address, government.address);
    await union(parametizer.address, plcrVoting.address);
    await union(parametizer.address, POU_SUPER_GROUP);
  });
};
