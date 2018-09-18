import * as store from "store";
import { BigNumber } from "bignumber.js";
import { EthAddress } from "@joincivil/core";

export function fetchVote(challengeId: BigNumber, user: EthAddress | undefined): string | undefined {
  if (!user) {
    return undefined;
  }
  const key = `voteOption:${challengeId.toFixed()}:${user}`;

  const savedVoteOption: string = store.get(key);

  return savedVoteOption;
}

export function saveVote(challengeId: BigNumber, user: EthAddress, voteOption: BigNumber): void {
  const key = `voteOption:${challengeId.toFixed()}:${user}`;
  store.set(key, voteOption);
}
