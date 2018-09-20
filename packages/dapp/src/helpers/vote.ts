import * as store from "store";
import { BigNumber } from "bignumber.js";
import { EthAddress } from "@joincivil/core";

export function fetchVote(challengeId: BigNumber, user: EthAddress | undefined): BigNumber | undefined {
  if (!user) {
    return undefined;
  }
  const key = `voteOption:${challengeId.toFixed()}:${user}`;

  const savedVoteOption: string = store.get(key);
  if (savedVoteOption) {
    return new BigNumber(savedVoteOption);
  } else {
    return undefined;
  }
}

export function saveVote(challengeId: BigNumber, user: EthAddress, voteOption: BigNumber): void {
  const key = `voteOption:${challengeId.toFixed()}:${user}`;
  store.set(key, voteOption.toString());
}
