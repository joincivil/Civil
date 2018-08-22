import * as React from "react";
import {
  InApplicationPhaseLabelText,
  ChallengeCommitVotePhaseLabelText,
  ChallengeRevealVotePhaseLabelText,
  InApplicationFlavorText,
  ChallengeCommitVoteFlavorText,
  ChallengeRevealVoteFlavorText,
} from "./textComponents";

export enum PHASE_TYPE_NAMES {
  IN_APPLICATION = "IN_APPLICATION",
  CHALLENGE_COMMIT_VOTE = "CHALLENGE_COMMIT_VOTE",
  CHALLENGE_REVEAL_VOTE = "CHALLENGE_REVEAL_VOTE",
}

export const PHASE_TYPE_LABEL: { [index: string]: React.SFC } = {
  IN_APPLICATION: InApplicationPhaseLabelText,
  CHALLENGE_COMMIT_VOTE: ChallengeCommitVotePhaseLabelText,
  CHALLENGE_REVEAL_VOTE: ChallengeRevealVotePhaseLabelText,
};

export const PHASE_TYPE_FLAVOR_TEXT: { [index: string]: React.SFC } = {
  IN_APPLICATION: InApplicationFlavorText,
  CHALLENGE_COMMIT_VOTE: ChallengeCommitVoteFlavorText,
  CHALLENGE_REVEAL_VOTE: ChallengeRevealVoteFlavorText,
};
