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

  const mapListingAddressToNewsroomListing = (listingAddresses: Set<string>) => {
    return listingAddresses
      .map(l => {
        return {
          newsroom: newsrooms.get(l!).wrapper,
          listing: listings.get(l!).listing,
        };
      })
      .toSet();
  };

  const applicationNewsroomListings = mapListingAddressToNewsroomListing(applications);
  const readyToWhitelistNewsroomListings = mapListingAddressToNewsroomListing(readyToWhitelistListings);
  const inChallengeCommitNewsroomListings = mapListingAddressToNewsroomListing(inChallengeCommitListings);
  const inChallengeRevealNewsroomListings = mapListingAddressToNewsroomListing(inChallengeRevealListings);
  const awaitingAppealRequestNewsroomListings = mapListingAddressToNewsroomListing(awaitingAppealRequestListings);
  const awaitingAppealJudgmentNewsroomListings = mapListingAddressToNewsroomListing(awaitingAppealJudgmentListings);
  const awaitingAppealChallengeNewsroomListings = mapListingAddressToNewsroomListing(awaitingAppealChallengeListings);
  const appealChallengeCommitPhaseNewsroomListings = mapListingAddressToNewsroomListing(
    appealChallengeCommitPhaseListings,
  );
  const appealChallengeRevealPhaseNewsroomListings = mapListingAddressToNewsroomListing(
    appealChallengeRevealPhaseListings,
  );
  const resolveChallengeNewsroomListings = mapListingAddressToNewsroomListing(resolveChallengeListings);
  const resolveAppealNewsroomListings = mapListingAddressToNewsroomListing(resolveAppealListings);

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
