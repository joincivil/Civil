import * as React from "react";
import styled from "styled-components";
import { Set } from "immutable";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { Link } from "react-router-dom";
import { ProposalsList } from "./ProposalsList";
import { ViewModule, ViewModuleHeader } from "../utility/ViewModules";

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%
  color: black;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

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
  } = state;

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
