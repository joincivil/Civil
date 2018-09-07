import * as React from "react";
import { Set } from "immutable";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { ProposalsList } from "./ProposalsList";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";

export interface ProposalsProps {
  proposalApplications: Set<object>;
  challengedCommitProposals: Set<object>;
  challengedRevealProposals: Set<object>;
  updateableProposals: Set<object>;
  resolvableChallengedProposals: Set<object>;
  error: any;
}

class Proposals extends React.Component<ProposalsProps> {
  public render(): JSX.Element {
    return (
      <ViewModule>
        <ViewModuleHeader>Parameterizer Proposals</ViewModuleHeader>
        Proposal Applications:<br />
        <ProposalsList proposals={this.props.proposalApplications} />
        <br />
        Challenged Proposals - Commit Vote:<br />
        <ProposalsList proposals={this.props.challengedCommitProposals} />
        <br />
        Challenged Proposals - Reveal Vote:<br />
        <ProposalsList proposals={this.props.challengedRevealProposals} />
        <br />
        Ready To Be Updated<br />
        <ProposalsList proposals={this.props.updateableProposals} />
        <br />
        Challenged Proposals - Resolvable<br />
        <ProposalsList proposals={this.props.resolvableChallengedProposals} />
        <br />
      </ViewModule>
    );
  }
}

const mapStateToProps = (state: State): ProposalsProps => {
  const {
    proposalApplications,
    challengedCommitProposals,
    challengedRevealProposals,
    updateableProposals,
    resolvableChallengedProposals,
  } = state.networkDependent;

  return {
    proposalApplications,
    challengedCommitProposals,
    challengedRevealProposals,
    updateableProposals,
    resolvableChallengedProposals,
    error: undefined,
  };
};

export default connect(mapStateToProps)(Proposals);
