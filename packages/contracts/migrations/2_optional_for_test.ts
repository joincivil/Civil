/* global artifacts */

import BN from "bignumber.js";
import { config } from "./utils";
import { MAIN_NETWORK } from "./utils/consts";

const MessagesAndCodes = artifacts.require("MessagesAndCodes");
const CivilTokenController = artifacts.require("CivilTokenController");
const NoOpTokenController = artifacts.require("NoOpTokenController");
const Token = artifacts.require("CVLToken");

const BASE_10 = 10;

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const totalSupply = new BN("100000000000000000000000000", BASE_10);
  const decimals = "18";

  async function giveTokensTo(addresses: string[], originalCount: number): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    let allocation;
    allocation = 50000000000000000000000;
    console.log("give " + allocation + " tokens to: " + user);
    await token.transfer(user, allocation);
    if (network === "ganache" && !accounts.includes(user)) {
      web3.eth.sendTransaction({ from: accounts[0], to: user, value: web3.toWei(1, "ether") });
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
