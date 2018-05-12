import { EthAddress } from "../types";
import { EthApi } from "./ethapi";

export enum CivilErrors {
  UnsupportedNetwork = "UNSUPPORTED_NETWORK",
  MalformedParams = "FUNCTION_PARAMETER_MALFORMED",
  NoUnlockedAccount = "NO_UNLOCKED_ETHEREUM_ACCOUNT",
  NoPrivileges = "NOT_ENOUGH_PRIVILEGES_FOR_ACTION",
  EvmException = "EVM_EXCEPTION_OCCURED",
  NoChallenge = "NO_CHALLENGE_FOUND_FOR_LISTING",
}

export function requireAccount(ethApi: EthApi): EthAddress {
  const account = ethApi.account;
  if (account === undefined) {
    throw new Error(CivilErrors.NoUnlockedAccount);
  }
  return account;
}
