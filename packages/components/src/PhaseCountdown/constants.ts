import * as React from "react";
import {
  InApplicationPhaseLabelText,
  ChallengeCommitVotePhaseLabelText,
  ChallengeRevealVotePhaseLabelText,
  ChallengeAwaitingAppealRequestPhaseLabelText,
  InApplicationFlavorText,
  ChallengeCommitVoteFlavorText,
  ChallengeRevealVoteFlavorText,
  ChallengeAwaitingAppealRequestFlavorText,
} from "./textComponents";

export enum PHASE_TYPE_NAMES {
  IN_APPLICATION = "IN_APPLICATION",
  CHALLENGE_COMMIT_VOTE = "CHALLENGE_COMMIT_VOTE",
  CHALLENGE_REVEAL_VOTE = "CHALLENGE_REVEAL_VOTE",
  CHALLENGE_AWAITING_APPEAL_REQUEST = "CHALLENGE_AWAITING_APPEAL_REQUEST",
}

export const PHASE_TYPE_LABEL: { [index: string]: React.SFC } = {
  IN_APPLICATION: InApplicationPhaseLabelText,
  CHALLENGE_COMMIT_VOTE: ChallengeCommitVotePhaseLabelText,
  CHALLENGE_REVEAL_VOTE: ChallengeRevealVotePhaseLabelText,
  CHALLENGE_AWAITING_APPEAL_REQUEST: ChallengeAwaitingAppealRequestPhaseLabelText,
};

export const PHASE_TYPE_FLAVOR_TEXT: { [index: string]: React.SFC } = {
  IN_APPLICATION: InApplicationFlavorText,
  CHALLENGE_COMMIT_VOTE: ChallengeCommitVoteFlavorText,
  CHALLENGE_REVEAL_VOTE: ChallengeRevealVoteFlavorText,
  CHALLENGE_AWAITING_APPEAL_REQUEST: ChallengeAwaitingAppealRequestFlavorText,
};
