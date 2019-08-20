/* global artifacts */

import { config } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";
import { BN } from "bn.js";

const MessagesAndCodes = artifacts.require("MessagesAndCodes");
const CivilTokenController = artifacts.require("CivilTokenController");
const NoOpTokenController = artifacts.require("NoOpTokenController");
const Token = artifacts.require("CVLToken");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const totalSupply = new BN("100000000000000000000000000");
  const decimals = "18";

  async function giveTokensTo(addresses: string[], originalCount: number): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    const allocation = new BN("50000000000000000000000");
    console.log("give " + allocation.toString() + " tokens to: " + user);
    await token.transfer(user, allocation);
    if (network === "ganache" && !accounts.includes(user)) {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: user,
        value: new BN(web3.utils.toWei("1", "ether")),
      });
    }

    if (addresses.length === 1) {
      return true;
    }
    return giveTokensTo(addresses.slice(1), originalCount);
  }

  deployer.deploy(MessagesAndCodes);
  deployer.link(MessagesAndCodes, CivilTokenController);

  deployer.then(async () => {
    let tokenName = "CVL";
    let symbol = "CVL";
    let giveTo: string[] = [];
    if (network !== MAIN_NETWORK) {
      tokenName = "TestCvl";
      symbol = "TESTCVL";

      const teammates = process.env.TEAMMATES;
      let teammatesSplit: string[] = [];
      if (teammates) {
        teammatesSplit = teammates!.split(",");
      }
      giveTo = accounts.concat(config.nets[network].tokenHolders, teammatesSplit);
    }

    const controller = await deployer.deploy(NoOpTokenController);
    await deployer.deploy(CivilTokenController);
    await deployer.deploy(Token, totalSupply, tokenName, decimals, symbol, controller.address);
    if (giveTo.length > 0) {
      await giveTokensTo(giveTo, giveTo.length);
    }
  });
};
