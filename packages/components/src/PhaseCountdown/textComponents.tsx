import * as React from "react";

export const InApplicationPhaseLabelText: React.SFC = props => <>Awaiting Approval</>;

export const ChallengeCommitVotePhaseLabelText: React.SFC = props => <>Under Challenge &gt; Commiting Votes</>;

export const ChallengeRevealVotePhaseLabelText: React.SFC = props => <>Under Challenge &gt; Revealing Votes</>;

export const ChallengeAwaitingAppealRequestPhaseLabelText: React.SFC = props => (
  <>Under Challenge &gt; Awaiting Appeal Request</>
);

export const InApplicationFlavorText: React.SFC = props => <>until approval</>;

export const ChallengeCommitVoteFlavorText: React.SFC = props => <>to submit votes</>;

export const ChallengeRevealVoteFlavorText: React.SFC = props => <>to reveal votes</>;

export const ChallengeAwaitingAppealRequestFlavorText: React.SFC = props => <>to request an appeal</>;
