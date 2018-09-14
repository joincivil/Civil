import * as React from "react";

export const MinDepositLabelText: React.SFC = props => <>Application Deposit</>;

export const ParamMinDepositLabelText: React.SFC = props => <>Parameter Proposal Deposit</>;

export const ApplicationStageLenLabelText: React.SFC = props => <>Duration for Application Stage</>;

export const ParamApplicationStageLenLabelText: React.SFC = props => (
  <>Duration for Parameter Proposal Application Stage</>
);

export const CommitStageLenLabelText: React.SFC = props => <>Duration for Commit Vote Stage</>;

export const ParamCommitStageLenLabelText: React.SFC = props => <>Duration for Parameter Commit Vote Stage</>;

export const RevealStageLenLabelText: React.SFC = props => <>Duration for Reveal Vote Stage</>;

export const ParamRevealStageLenLabelText: React.SFC = props => <>Duration for Parameter Reveal Vote Stage</>;

export const DispensationPctLabelText: React.SFC = props => <>Percentage of Stake Distributed To Challenge Winner</>;

export const ParamDispensationPctLabelText: React.SFC = props => (
  <>Percentage of Stake Distributed To Parameter Proposal Challenge Winner</>
);

export const VoteQuorumLabelText: React.SFC = props => <>Percentage of Votes Needed For Quorum</>;

export const ParamVoteQuorumLabelText: React.SFC = props => (
  <>Percentage of Votes Needed For Quorum for Parameter Proposal Challenge</>
);

export const ParamProcessByLabelText: React.SFC = props => <>Duration of Parameter Proposal Processing Stage</>;

export const ChallengeAppealLenLabelText: React.SFC = props => <>Duration of Challenge Appeal Stage</>;

export const ChallengeAppealCommitStageLenLabelText: React.SFC = props => (
  <>Duration of Challenge Appeal Commit Vote Stage</>
);

export const ChallengeAppealRevealStageLenLabelText: React.SFC = props => (
  <>Duration of Challenge Appeal Reveal Vote Stage</>
);

export const RequestAppealLenLabelText: React.SFC = props => <>Duration of Request Appeal Stage</>;

export const JudgeAppealLenLabelText: React.SFC = props => <>Duration of Judge Appeal Stage</>;

export const AppealFeeLabelText: React.SFC = props => <>Request Appeal Deposit</>;

export const AppealVotePercentageLabelText: React.SFC = props => (
  <>Percentage of Votes Needed To Overturn a Granted Appeal</>
);

// Create Proposal
export const CreateProposalHeaderText: React.SFC = props => <>Propose New Value</>;

export interface CreateProposalDescriptionTextProps {
  applicationLenText: string | JSX.Element;
}

export const CreateProposalDescriptionText: React.SFC<CreateProposalDescriptionTextProps> = props => (
  <>
    Create a new proposal to change a parameter value on The Civil Registry. The CVL token holder community will have{" "}
    {props.applicationLenText} to challenge the proposal. If there are no challenges, the new value will be
    automatically approved.
  </>
);

export const CreateProposalParamNameLabelText: React.SFC = props => <>Parameter Name</>;

export const CreateProposalParamCurrentValueLabelText: React.SFC = props => <>Current Value</>;

export const CreateProposalTokenDepositText: React.SFC = props => <>Total token deposit</>;

// Challenge Proposal
export const ChallengeProposalHeaderText: React.SFC = props => <>Challenge Proposal</>;

export const ChallengeProposalDescriptionText: React.SFC = props => <>Challenge this proposal.</>;

export const ChallengeProposalNewValueLabelText: React.SFC = props => <>Proposed Value</>;

export const ResolveChallengeProposalDescriptionText: React.SFC = props => <>Resolve this Proposal Challenge</>;

export const ProcessProposalDescriptionText: React.SFC = props => (
  <>Process this proposal and update the Registry Parameters with the new value</>
);
