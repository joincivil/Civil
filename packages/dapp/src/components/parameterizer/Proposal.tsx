import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../reducers";
import { PageView, ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { Link } from "react-router-dom";

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
          {!this.props.proposal && this.renderProposalNotFound()}
        </ViewModule>
      </PageView>
    );
  }

  private renderProposalNotFound = (): JSX.Element => {
    return <>Proposal Not Found</>;
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
