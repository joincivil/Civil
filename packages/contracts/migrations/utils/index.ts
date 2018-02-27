import * as fs from "fs";

import { MAIN_NETWORK } from "./consts";

export const config = JSON.parse(fs.readFileSync("../../conf/config.json").toString())

export function inTesting(network: string) {
  return network !== MAIN_NETWORK && !(network in config.testnets);
}

//export function approveEverything(accounts)
