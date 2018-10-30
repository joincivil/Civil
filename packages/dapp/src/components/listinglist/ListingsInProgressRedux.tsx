import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { State } from "../../redux/reducers";
import ListingsInProgress from "./ListingsInProgress";
export interface ListingProps {
  match?: any;
  history?: any;
}

export interface ListingReduxProps {
  applications: Set<string>;
  readyToWhitelistListings: Set<string>;
  inChallengeCommitListings: Set<string>;
  inChallengeRevealListings: Set<string>;
  awaitingAppealRequestListings: Set<string>;
  awaitingAppealJudgmentListings: Set<string>;
  awaitingAppealChallengeListings: Set<string>;
  appealChallengeCommitPhaseListings: Set<string>;
  appealChallengeRevealPhaseListings: Set<string>;
  resolveChallengeListings: Set<string>;
  resolveAppealListings: Set<string>;
}

class ListingsInProgressRedux extends React.Component<ListingProps & ListingReduxProps> {
  public render(): JSX.Element {
    console.log("Listings in Progress Redux");
    return <ListingsInProgress {...this.props} />;
  }
}

const mapStateToProps = (state: State, ownProps: ListingProps): ListingProps & ListingReduxProps => {
  const {
    applications,
    readyToWhitelistListings,
    inChallengeCommitListings,
    inChallengeRevealListings,
    awaitingAppealRequestListings,
    awaitingAppealJudgmentListings,
    awaitingAppealChallengeListings,
    appealChallengeCommitPhaseListings,
    appealChallengeRevealPhaseListings,
    resolveChallengeListings,
    resolveAppealListings,
  } = state.networkDependent;

  return {
    applications,
    readyToWhitelistListings,
    inChallengeCommitListings,
    inChallengeRevealListings,
    awaitingAppealRequestListings,
    awaitingAppealJudgmentListings,
    awaitingAppealChallengeListings,
    appealChallengeCommitPhaseListings,
    appealChallengeRevealPhaseListings,
    resolveChallengeListings,
    resolveAppealListings,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingsInProgressRedux);
