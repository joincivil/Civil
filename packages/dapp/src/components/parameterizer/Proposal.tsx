import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { PageView, ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { Link } from "react-router-dom";
import { ParamProposalState, TwoStepEthTransaction } from "@joincivil/core";
import TransactionButton from "../utility/TransactionButton";
import CountdownTimer from "../utility/CountdownTimer";
import {
  approveForProposalChallenge,
  challengeReparameterization,
  updateReparameterizationProp,
  resolveReparameterizationChallenge,
} from "../../apis/civilTCR";
import { StyledFormContainer, FormGroup } from "../utility/FormElements";
import CommitVoteDetail from "../listing/CommitVoteDetail";
import RevealVoteDetail from "../listing/RevealVoteDetail";

export interface ProposalPageProps {
  match: any;
}

export interface ProposalReduxProps {
  proposal: any;
  error: any;
}

class Proposal extends React.Component<ProposalPageProps & ProposalReduxProps> {
  public render(): JSX.Element {
    console.log(this.props.proposal);
    return (
      <PageView>
        <ViewModule>
          <Link to="/parameterizer">&laquo; Back to Parameterizer</Link>
          <ViewModuleHeader>Parameterizer Proposal</ViewModuleHeader>
          {this.props.proposal && (
            <dl>
              <dt>Parameter Name</dt>
              <dd>{this.props.proposal.paramName}</dd>
              <dt>New Value</dt>
              <dd>{this.props.proposal.propValue.toString()}</dd>
            </dl>
          )}

          {this.props.proposal && this.renderProposalActions()}

          {!this.props.proposal && this.renderProposalNotFound()}
        </ViewModule>
      </PageView>
    );
  }

  private renderProposalNotFound = (): JSX.Element => {
    return <>Proposal Not Found</>;
  };

  private renderProposalActions = (): JSX.Element => {
    const propState = this.props.proposal.state;
    switch (propState) {
      case ParamProposalState.APPLYING:
        return this.renderCanBeChallenged();
      case ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
        return this.renderCommitState();
      case ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
        return this.renderRevealState();
      case ParamProposalState.READY_TO_PROCESS:
        return this.renderUpdateParam();
      case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
        return this.renderResolveChallenge();
      // return <></>;
      default:
        return <></>;
    }
  };

  private renderCanBeChallenged = (): JSX.Element => {
    return (
      <StyledFormContainer>
        Proposal Application Phase ends in{" "}
        <CountdownTimer endTime={this.props.proposal.applicationExpiry.valueOf() / 1000} />
        <FormGroup>
          <TransactionButton
            transactions={[{ transaction: approveForProposalChallenge }, { transaction: this.challengeProposal }]}
          >
            Challenge Proposal
          </TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  };

  private renderUpdateParam = (): JSX.Element => {
    return (
      <StyledFormContainer>
        Parameter Update Phase ends in{" "}
        <CountdownTimer endTime={this.props.proposal.propProcessByExpiry.valueOf / 1000} />
        <FormGroup>
          <TransactionButton transactions={[{ transaction: this.updateProposal }]}>Update Parameter</TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  };

  private renderResolveChallenge = (): JSX.Element => {
    return (
      <StyledFormContainer>
        Resolve Challenge Phase ends in{" "}
        <CountdownTimer endTime={this.props.proposal.propProcessByExpiry.valueOf() / 1000} />
        <FormGroup>
          <TransactionButton transactions={[{ transaction: this.resolveChallenge }]}>
            Resolve Challenge
          </TransactionButton>
        </FormGroup>
      </StyledFormContainer>
    );
  };

  private renderCommitState = (): JSX.Element => {
    return (
      <>
        Commit Vote Phase ends in{" "}
        <CountdownTimer endTime={this.props.proposal.challenge.challengeCommitExpiry.valueOf() / 1000} />
        <CommitVoteDetail challengeID={this.props.proposal.challenge.id} />
      </>
    );
  };

  private renderRevealState = (): JSX.Element => {
    return (
      <>
        Reveal Vote Phase ends in{" "}
        <CountdownTimer endTime={this.props.proposal.challenge.challengeRevealExpiry.valueOf() / 1000} />
        <RevealVoteDetail challengeID={this.props.proposal.challenge.id} />
      </>
    );
  };

  private challengeProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return challengeReparameterization(this.props.proposal.id);
  };

  private updateProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return updateReparameterizationProp(this.props.proposal.id);
  };

  private resolveChallenge = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return resolveReparameterizationChallenge(this.props.proposal.id);
  };
}

const mapStateToProps = (state: State, ownProps: ProposalPageProps): ProposalReduxProps => {
  const { proposals } = state;

  return {
    proposal: proposals.get(ownProps.match.params.propId),
    error: undefined,
  };
};

export default connect(mapStateToProps)(Proposal);
