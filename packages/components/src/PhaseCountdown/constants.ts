import * as React from "react";
import {
  InApplicationPhaseLabelText,
  ChallengeCommitVotePhaseLabelText,
  ChallengeRevealVotePhaseLabelText,
  ChallengeAwaitingAppealRequestPhaseLabelText,
  ChallengeAwaitingAppealJudgementPhaseLabelText,
  InApplicationFlavorText,
  ChallengeCommitVoteFlavorText,
  ChallengeRevealVoteFlavorText,
  ChallengeAwaitingAppealRequestFlavorText,
  ChallengeAwaitingAppealJudgementFlavorText,
  ChallengeAwaitingAppealChallengePhaseLabelText,
  ChallengeAwaitingAppealChallengeFlavorText,
} from "./textComponents";

export enum PHASE_TYPE_NAMES {
  IN_APPLICATION = "IN_APPLICATION",
  CHALLENGE_COMMIT_VOTE = "CHALLENGE_COMMIT_VOTE",
  CHALLENGE_REVEAL_VOTE = "CHALLENGE_REVEAL_VOTE",
  CHALLENGE_AWAITING_APPEAL_REQUEST = "CHALLENGE_AWAITING_APPEAL_REQUEST",
  CHALLENGE_AWAITING_APPEAL_JUDGEMENT = "CHALLENGE_AWAITING_APPEAL_JUDGEMENT",
  CHALLENGE_AWAITING_APPEAL_CHALLENGE = "CHALLENGE_AWAITING_APPEAL_CHALLENGE",
  APPEAL_CHALLENGE_COMMIT_VOTE = "APPEAL_CHALLENGE_COMMIT_VOTE",
  APPEAL_CHALLENGE_REVEAL_VOTE = "APPEAL_CHALLENGE_REVEAL_VOTE",
}

export const PHASE_TYPE_LABEL: { [index: string]: React.FunctionComponent } = {
  IN_APPLICATION: InApplicationPhaseLabelText,
  CHALLENGE_COMMIT_VOTE: ChallengeCommitVotePhaseLabelText,
  CHALLENGE_REVEAL_VOTE: ChallengeRevealVotePhaseLabelText,
  CHALLENGE_AWAITING_APPEAL_REQUEST: ChallengeAwaitingAppealRequestPhaseLabelText,
  CHALLENGE_AWAITING_APPEAL_JUDGEMENT: ChallengeAwaitingAppealJudgementPhaseLabelText,
  CHALLENGE_AWAITING_APPEAL_CHALLENGE: ChallengeAwaitingAppealChallengePhaseLabelText,
  APPEAL_CHALLENGE_COMMIT_VOTE: ChallengeCommitVotePhaseLabelText,
  APPEAL_CHALLENGE_REVEAL_VOTE: ChallengeRevealVotePhaseLabelText,
};

export const PHASE_TYPE_FLAVOR_TEXT: { [index: string]: React.FunctionComponent } = {
  IN_APPLICATION: InApplicationFlavorText,
  CHALLENGE_COMMIT_VOTE: ChallengeCommitVoteFlavorText,
  CHALLENGE_REVEAL_VOTE: ChallengeRevealVoteFlavorText,
  CHALLENGE_AWAITING_APPEAL_REQUEST: ChallengeAwaitingAppealRequestFlavorText,
  CHALLENGE_AWAITING_APPEAL_JUDGEMENT: ChallengeAwaitingAppealJudgementFlavorText,
  CHALLENGE_AWAITING_APPEAL_CHALLENGE: ChallengeAwaitingAppealChallengeFlavorText,
  APPEAL_CHALLENGE_COMMIT_VOTE: ChallengeCommitVoteFlavorText,
  APPEAL_CHALLENGE_REVEAL_VOTE: ChallengeRevealVoteFlavorText,
};
