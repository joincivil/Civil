import { colors } from "../styleConstants";

import { VoteTypeColorProps } from "./types";

export enum CHALLENGE_RESULTS_VOTE_TYPES {
  REMAIN = "REMAIN",
  REMOVE = "REMOVE",
  OVERTURN = "OVERTURN",
  UPHOLD = "UPHOLD",
}

export const voteColor: VoteTypeColorProps = {
  [CHALLENGE_RESULTS_VOTE_TYPES.REMAIN]: colors.accent.CIVIL_TEAL,
  [CHALLENGE_RESULTS_VOTE_TYPES.REMOVE]: colors.accent.CIVIL_RED,
  [CHALLENGE_RESULTS_VOTE_TYPES.OVERTURN]: colors.accent.CIVIL_ORANGE,
  [CHALLENGE_RESULTS_VOTE_TYPES.UPHOLD]: colors.accent.CIVIL_GREEN,
};
