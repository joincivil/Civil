import * as fs from "fs";

import { MAIN_NETWORK } from "./consts";

export const config = JSON.parse(
  fs
    .readFileSync("../../conf/config.json")
    .toString());

export function inTesting(network: string): boolean {
  return network !== MAIN_NETWORK && !(network in config.testnets);
}

export async function approveEverything(addresses: string[], token: any, target: string): Promise<void> {
  await Promise.all(
    addresses.map(async (user) => {
      const balance = await token.balanceOf(user);
      await token.approve(target, balance, { from: user });
    }));
}
