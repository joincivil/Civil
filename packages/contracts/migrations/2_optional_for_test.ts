/* global artifacts */

import BN from "bignumber.js";

import { config } from "./utils";
import { MAIN_NETWORK, RINKEBY } from "./utils/consts";

const Token = artifacts.require("EIP20");

const BASE_10 = 10;

const teammates = process.env.TEAMMATES;
const teammatesSplit = teammates!.split(",");

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const totalSupply = new BN("1000000000000000000000000", BASE_10);
  const decimals = "18";

  async function giveTokensTo(addresses: string[], originalCount: number): Promise<boolean> {
    const token = await Token.deployed();
    const user = addresses[0];
    let allocation;
    allocation = totalSupply.div(new BN(originalCount, BASE_10));
    console.log("give " + allocation + " tokens to: " + user);
    await token.transfer(user, allocation);

    if (addresses.length === 1) {
      return true;
    }
    return giveTokensTo(addresses.slice(1), originalCount);
  }
  deployer.then(async () => {
    if (network === RINKEBY) {
      await deployer.deploy(Token, totalSupply, "TestCvl", decimals, "TESTCVL");
      return giveTokensTo(teammatesSplit, teammatesSplit.length);
    } else if (network !== MAIN_NETWORK) {
      await deployer.deploy(Token, totalSupply, "TestCvl", decimals, "TESTCVL");
      return giveTokensTo(accounts, accounts.length);
    }
  });
};
