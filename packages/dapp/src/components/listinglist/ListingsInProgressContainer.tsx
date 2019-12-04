import * as React from "react";
import { Set } from "immutable";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  LISTING_FRAGMENT,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
  listingHelpers,
} from "@joincivil/utils";
import { NewsroomListing } from "@joincivil/typescript-types";
import { LoadingMessage } from "@joincivil/components";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import ListingsInProgress from "./ListingsInProgress";

export interface ListingsInProgressProps {
  match?: any;
  history?: any;
  govtParameters: any;
}
export interface ListingsInProgressState {
  increment: number;
}
const LISTINGS_QUERY = gql`
  query($activeChallenge: Boolean!, $currentApplication: Boolean!, $sortBy: ListingSort) {
    listings(activeChallenge: $activeChallenge, currentApplication: $currentApplication, sortBy: $sortBy) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;
class ListingsInProgressContainer extends React.Component<ListingsInProgressProps, ListingsInProgressState> {
  constructor(props: ListingsInProgressProps) {
    super(props);
    this.state = { increment: 0 };
  }
  public render(): JSX.Element {
    return (
      <Query
        query={LISTINGS_QUERY}
        variables={{ activeChallenge: true, currentApplication: true, sortBy: "NAME" }}
        pollInterval={30000}
      >
        {({ loading, error, data }: any): JSX.Element => {
          if (loading && !data) {
            return <LoadingMessage />;
          }
          if (error) {
            return <ErrorLoadingDataMsg />;
          }
          const map = Set<any>(data.listings);
          const allListings: Set<NewsroomListing> = map
            .map(listing => {
              return {
                listing: transformGraphQLDataIntoListing(listing, listing!.contractAddress),
                newsroom: transformGraphQLDataIntoNewsroom(listing, listing!.contractAddress),
              };
            })
            .toSet();

          let soonestExpiry = Number.MAX_SAFE_INTEGER;
          allListings.forEach(listing => {
            const expiry = listingHelpers.getNextTimerExpiry(listing!.listing.data);
            if (expiry > 0 && expiry < soonestExpiry) {
              soonestExpiry = expiry;
            }
          });
          const nowSeconds = Date.now() / 1000;
          const delaySeconds = soonestExpiry - nowSeconds;
          setTimeout(this.onTimerExpiry, delaySeconds * 1000);

          const applications = allListings
            .filter(listing => listingHelpers.isInApplicationPhase(listing!.listing.data))
            .toSet();

          const readyToWhitelistListings = allListings
            .filter(listing => listingHelpers.canBeWhitelisted(listing!.listing.data))
            .toSet();

          const inChallengeCommitListings = allListings
            .filter(listing => listingHelpers.isInChallengedCommitVotePhase(listing!.listing.data))
            .toSet();

          const inChallengeRevealListings = allListings
            .filter(listing => listingHelpers.isInChallengedRevealVotePhase(listing!.listing.data))
            .toSet();

          const awaitingAppealRequestListings = allListings
            .filter(listing => listingHelpers.isAwaitingAppealRequest(listing!.listing.data))
            .toSet();

          const awaitingAppealJudgmentListings = allListings
            .filter(listing => listingHelpers.isListingAwaitingAppealJudgment(listing!.listing.data))
            .toSet();

          const awaitingAppealChallengeListings = allListings
            .filter(listing => listingHelpers.isListingAwaitingAppealChallenge(listing!.listing.data))
            .toSet();

          const appealChallengeCommitPhaseListings = allListings
            .filter(listing => listingHelpers.isInAppealChallengeCommitPhase(listing!.listing.data))
            .toSet();

          const appealChallengeRevealPhaseListings = allListings
            .filter(listing => listingHelpers.isInAppealChallengeRevealPhase(listing!.listing.data))
            .toSet();

          const resolveChallengeListings = allListings
            .filter(listing => listingHelpers.canChallengeBeResolved(listing!.listing.data))
            .toSet();

          const resolveAppealListings = allListings
            .filter(listing => listingHelpers.canListingAppealBeResolved(listing!.listing.data))
            .toSet();

          return (
            <>
              <ListingsInProgress
                applications={applications}
                readyToWhitelistListings={readyToWhitelistListings}
                inChallengeCommitListings={inChallengeCommitListings}
                inChallengeRevealListings={inChallengeRevealListings}
                awaitingAppealRequestListings={awaitingAppealRequestListings}
                awaitingAppealJudgmentListings={awaitingAppealJudgmentListings}
                awaitingAppealChallengeListings={awaitingAppealChallengeListings}
                appealChallengeCommitPhaseListings={appealChallengeCommitPhaseListings}
                appealChallengeRevealPhaseListings={appealChallengeRevealPhaseListings}
                resolveChallengeListings={resolveChallengeListings}
                resolveAppealListings={resolveAppealListings}
                {...this.props}
              />
            </>
          );
        }}
      </Query>
    );
  }
  public onTimerExpiry = (): void => {
    this.setState({ increment: this.state.increment + 1 });
  };
}

export default ListingsInProgressContainer;
