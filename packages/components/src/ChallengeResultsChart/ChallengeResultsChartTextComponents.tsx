import * as React from "react";
import { HollowGreenCheck, HollowRedNoGood } from "../icons";
import { VoteTypeLabelProps } from "./types";
import { CHALLENGE_RESULTS_VOTE_TYPES } from "./constants";

export const voteTypeLabel: VoteTypeLabelProps = {
  [CHALLENGE_RESULTS_VOTE_TYPES.REMAIN]: (
    <>
      <HollowGreenCheck width={14} height={14} /> Accept
    </>
  ),
  [CHALLENGE_RESULTS_VOTE_TYPES.REMOVE]: (
    <>
      <HollowRedNoGood width={14} height={14} /> Reject
    </>
  ),
  [CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN]: <>Overturn</>,
  [CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD]: <>Uphold</>,
};
