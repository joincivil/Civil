import { Web3Wrapper } from "./web3wrapper";

export enum CivilErrors {
  NoUnlockedAccount = "NO_UNLOCKED_ETHEREUM_ACCOUNT",
  NoPrivileges = "NOT_ENOUGH_PRIVILEGES_FOR_ACTION",
}

export function requireAccount(web3Wrapper: Web3Wrapper) {
  if (web3Wrapper.account === undefined) {
    throw new Error(CivilErrors.NoUnlockedAccount);
  }
}
