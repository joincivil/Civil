import * as React from "react";

export const InApplicationPhaseLabelText: React.SFC = props => <>Awaiting Approval</>;

export const ChallengeCommitVotePhaseLabelText: React.SFC = props => <>Commit Vote</>;

export const ChallengeRevealVotePhaseLabelText: React.SFC = props => <>Confirm Vote</>;

export const ChallengeAwaitingAppealRequestPhaseLabelText: React.SFC = props => <>Awaiting Appeal Request</>;

export const ChallengeAwaitingAppealJudgementPhaseLabelText: React.SFC = props => <>Awaiting Appeal Decision</>;

export const ChallengeAwaitingAppealChallengePhaseLabelText: React.SFC = props => <>Awaiting Appeal Challenge</>;

export const InApplicationFlavorText: React.SFC = props => <>until approval</>;

export const ChallengeCommitVoteFlavorText: React.SFC = props => <>to commit votes</>;

export const ChallengeRevealVoteFlavorText: React.SFC = props => <>to confirm votes</>;

export const ChallengeAwaitingAppealRequestFlavorText: React.SFC = props => <>to request an appeal</>;

export const ChallengeAwaitingAppealJudgementFlavorText: React.SFC = props => <>until Council's decision</>;

export const ChallengeAwaitingAppealChallengeFlavorText: React.SFC = props => <>to challenge the granted appeal</>;
