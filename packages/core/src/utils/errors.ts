import { EthAddress } from "../types";
import { Web3Wrapper } from "./web3wrapper";

export enum CivilErrors {
  UnsupportedNetwork = "UNSUPPORTED_NETWORK",
  MalformedParams = "FUNCTION_PARAMETER_MALFORMED",
  NoUnlockedAccount = "NO_UNLOCKED_ETHEREUM_ACCOUNT",
  NoPrivileges = "NOT_ENOUGH_PRIVILEGES_FOR_ACTION",
  EvmException = "EVM_EXCEPTION_OCCURED",
  NoChallenge = "NO_CHALLENGE_FOUND_FOR_LISTING",
}

export function requireAccount(web3Wrapper: Web3Wrapper): EthAddress {
  const account = web3Wrapper.account;
  if (account === undefined) {
    throw new Error(CivilErrors.NoUnlockedAccount);
  }
  return account;
}
