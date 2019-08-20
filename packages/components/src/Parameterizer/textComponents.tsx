import * as React from "react";

export const MinDepositLabelText: React.FunctionComponent = props => <>Application Deposit</>;

export const ParamMinDepositLabelText: React.FunctionComponent = props => <>Parameter Proposal Deposit</>;

export const ApplicationStageLenLabelText: React.FunctionComponent = props => <>Duration for Application Stage</>;

export const ParamApplicationStageLenLabelText: React.FunctionComponent = props => (
  <>Duration for Parameter Proposal Application Stage</>
);

export const CommitStageLenLabelText: React.FunctionComponent = props => <>Duration for Commit Vote Stage</>;

export const ParamCommitStageLenLabelText: React.FunctionComponent = props => (
  <>Duration for Parameter Commit Vote Stage</>
);

export const RevealStageLenLabelText: React.FunctionComponent = props => <>Duration for Reveal Vote Stage</>;

export const ParamRevealStageLenLabelText: React.FunctionComponent = props => (
  <>Duration for Parameter Reveal Vote Stage</>
);

export const DispensationPctLabelText: React.FunctionComponent = props => (
  <>Percentage of Stake Distributed To Challenge Winner</>
);

export const ParamDispensationPctLabelText: React.FunctionComponent = props => (
  <>Percentage of Stake Distributed To Parameter Proposal Challenge Winner</>
);

export const VoteQuorumLabelText: React.FunctionComponent = props => (
  <>Percentage of Votes Needed for Challenge to Succeed</>
);

export const ParamVoteQuorumLabelText: React.FunctionComponent = props => (
  <>Percentage of Votes Needed for Parameter Proposal Challenge to Succeed</>
);

export const ChallengeAppealLenLabelText: React.FunctionComponent = props => <>Duration of Challenge Appeal Stage</>;

export const ChallengeAppealCommitStageLenLabelText: React.FunctionComponent = props => (
  <>Duration of Challenge Appeal Commit Vote Stage</>
);

export const ChallengeAppealRevealStageLenLabelText: React.FunctionComponent = props => (
  <>Duration of Challenge Appeal Reveal Vote Stage</>
);

export const RequestAppealLenLabelText: React.FunctionComponent = props => <>Duration of Request Appeal Stage</>;

export const JudgeAppealLenLabelText: React.FunctionComponent = props => <>Duration of Judge Appeal Stage</>;

export const GovtProposalCommitStageLenLabelText: React.FunctionComponent = props => (
  <>Duration of Government Proposal Commit Vote Stage</>
);

export const GovtProposalRevealStageLenLabelText: React.FunctionComponent = props => (
  <>Duration of Government Proposal Reveal Vote Stage</>
);

export const AppealFeeLabelText: React.FunctionComponent = props => <>Request Appeal Deposit</>;

export const AppealVotePercentageLabelText: React.FunctionComponent = props => (
  <>Percentage of Votes Needed To Overturn a Granted Appeal</>
);

export const AppealVoteDispensationPctLabelText: React.FunctionComponent = props => (
  <>Percentage of Stake Distributed To Appeal Challenge Winner</>
);

// Create Proposal
export const CreateProposalHeaderText: React.FunctionComponent = props => <>Propose New Value</>;

export interface CreateProposalDescriptionTextProps {
  applicationLenText: string | JSX.Element;
}

export const CreateProposalDescriptionText: React.FunctionComponent<CreateProposalDescriptionTextProps> = props => (
  <>
    Create a new proposal to change a parameter value on The Civil Registry. The CVL token holder community will have{" "}
    {props.applicationLenText} to challenge the proposal. If there are no challenges, the new value will be
    automatically approved.
  </>
);

export const CreateProposalParamNameLabelText: React.FunctionComponent = props => <>Parameter Name</>;

export const CreateProposalParamCurrentValueLabelText: React.FunctionComponent = props => <>Current Value</>;

export const CreateProposalTokenDepositText: React.FunctionComponent = props => <>Total token deposit</>;

// Challenge Proposal
export const ChallengeProposalHeaderText: React.FunctionComponent = props => <>Challenge Proposal</>;

export const ChallengeProposalDescriptionText: React.FunctionComponent = props => <>Challenge this proposal.</>;

export const ChallengeProposalNewValueLabelText: React.FunctionComponent = props => <>Proposed Value</>;

export const ResolveChallengeProposalDescriptionText: React.FunctionComponent = props => (
  <>Resolve this Proposal Challenge</>
);

export const ProcessProposalDescriptionText: React.FunctionComponent = props => (
  <>Process this proposal and update the Registry Parameters with the new value</>
);
