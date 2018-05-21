import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { PageView, ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { Link } from "react-router-dom";
import { ParamProposalState, TwoStepEthTransaction } from "@joincivil/core";
import TransactionButton from "../utility/TransactionButton";
import { approveForProposalChallenge, challengeReparameterization } from "../../apis/civilTCR";
import { StyledFormContainer, FormGroup } from "../utility/FormElements";
import CommitVoteDetail from "../listing/CommitVoteDetail";

export interface ProposalPageProps {
  match: any;
}

export interface ProposalReduxProps {
  proposal: any;
  error: any;
}

class Proposal extends React.Component<ProposalPageProps & ProposalReduxProps> {
  public render(): JSX.Element {
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
        return this.renderCommitState();
        // return <></>;
      case ParamProposalState.READY_TO_PROCESS:
        return this.renderCommitState();
        // return <></>;
      case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
        return this.renderCommitState();
        // return <></>;
      default:
        return <></>;
    }
  };

  private renderCanBeChallenged = (): JSX.Element => {
    return (
      <StyledFormContainer>
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

  private renderCommitState = (): JSX.Element => {
    return (
      <CommitVoteDetail challengeID={this.props.proposal.id} />
    );
  };

  private challengeProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return challengeReparameterization(this.props.proposal.id);
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
