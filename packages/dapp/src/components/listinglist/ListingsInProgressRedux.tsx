import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { State } from "../../redux/reducers";
import ListingsInProgress from "./ListingsInProgress";
import { NewsroomListing } from "@joincivil/core";
export interface ListingProps {
  match?: any;
  history?: any;
}

export interface ListingReduxProps {
  applications: Set<NewsroomListing>;
  readyToWhitelistListings: Set<NewsroomListing>;
  inChallengeCommitListings: Set<NewsroomListing>;
  inChallengeRevealListings: Set<NewsroomListing>;
  awaitingAppealRequestListings: Set<NewsroomListing>;
  awaitingAppealJudgmentListings: Set<NewsroomListing>;
  awaitingAppealChallengeListings: Set<NewsroomListing>;
  appealChallengeCommitPhaseListings: Set<NewsroomListing>;
  appealChallengeRevealPhaseListings: Set<NewsroomListing>;
  resolveChallengeListings: Set<NewsroomListing>;
  resolveAppealListings: Set<NewsroomListing>;
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
    listings,
  } = state.networkDependent;
  const { newsrooms } = state;

  const applicationNewsroomListings = applications
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const readyToWhitelistNewsroomListings = readyToWhitelistListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const inChallengeCommitNewsroomListings = inChallengeCommitListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const inChallengeRevealNewsroomListings = inChallengeRevealListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const awaitingAppealRequestNewsroomListings = awaitingAppealRequestListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const awaitingAppealJudgmentNewsroomListings = awaitingAppealJudgmentListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const awaitingAppealChallengeNewsroomListings = awaitingAppealChallengeListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const appealChallengeCommitPhaseNewsroomListings = appealChallengeCommitPhaseListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const appealChallengeRevealPhaseNewsroomListings = appealChallengeRevealPhaseListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const resolveChallengeNewsroomListings = resolveChallengeListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  const resolveAppealNewsroomListings = resolveAppealListings
    .map(l => {
      return {
        newsroom: newsrooms.get(l!).wrapper,
        listing: listings.get(l!).listing,
      };
    })
    .toSet();

  return {
    applications: applicationNewsroomListings,
    readyToWhitelistListings: readyToWhitelistNewsroomListings,
    inChallengeCommitListings: inChallengeCommitNewsroomListings,
    inChallengeRevealListings: inChallengeRevealNewsroomListings,
    awaitingAppealRequestListings: awaitingAppealRequestNewsroomListings,
    awaitingAppealJudgmentListings: awaitingAppealJudgmentNewsroomListings,
    awaitingAppealChallengeListings: awaitingAppealChallengeNewsroomListings,
    appealChallengeCommitPhaseListings: appealChallengeCommitPhaseNewsroomListings,
    appealChallengeRevealPhaseListings: appealChallengeRevealPhaseNewsroomListings,
    resolveChallengeListings: resolveChallengeNewsroomListings,
    resolveAppealListings: resolveAppealNewsroomListings,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingsInProgressRedux);
