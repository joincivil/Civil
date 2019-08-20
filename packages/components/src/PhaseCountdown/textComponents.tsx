import * as React from "react";

export const InApplicationPhaseLabelText: React.FunctionComponent = props => <>Awaiting Approval</>;

export const ChallengeCommitVotePhaseLabelText: React.FunctionComponent = props => <>Commit Vote</>;

export const ChallengeRevealVotePhaseLabelText: React.FunctionComponent = props => <>Reveal Vote</>;

export const ChallengeAwaitingAppealRequestPhaseLabelText: React.FunctionComponent = props => (
  <>Awaiting Appeal Request</>
);

export const ChallengeAwaitingAppealJudgementPhaseLabelText: React.FunctionComponent = props => (
  <>Awaiting Appeal Decision</>
);

export const ChallengeAwaitingAppealChallengePhaseLabelText: React.FunctionComponent = props => (
  <>Awaiting Appeal Challenge</>
);

export const InApplicationFlavorText: React.FunctionComponent = props => <>until approval</>;

export const ChallengeCommitVoteFlavorText: React.FunctionComponent = props => <>to commit votes</>;

export const ChallengeRevealVoteFlavorText: React.FunctionComponent = props => <>to reveal votes</>;

export const ChallengeAwaitingAppealRequestFlavorText: React.FunctionComponent = props => <>to request an appeal</>;

export const ChallengeAwaitingAppealJudgementFlavorText: React.FunctionComponent = props => (
  <>until Council's decision</>
);

export const ChallengeAwaitingAppealChallengeFlavorText: React.FunctionComponent = props => (
  <>to challenge the granted appeal</>
);
