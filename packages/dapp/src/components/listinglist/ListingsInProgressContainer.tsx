import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { State } from "../../redux/reducers";
import ListingsInProgressRedux from "./ListingsInProgressRedux";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  LISTING_FRAGMENT,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
} from "../../helpers/queryTransformations";
import {
  isInApplicationPhase,
  isInChallengedCommitVotePhase,
  canBeWhitelisted,
  isInChallengedRevealVotePhase,
  isAwaitingAppealRequest,
  isInAppealChallengeCommitPhase,
  isInAppealChallengeRevealPhase,
  isListingAwaitingAppealJudgment,
  isListingAwaitingAppealChallenge,
  canChallengeBeResolved,
  canListingAppealBeResolved,
  getNextTimerExpiry,
  NewsroomListing,
} from "@joincivil/core";
import ListingsInProgress from "./ListingsInProgress";

export interface ListingsInProgressProps {
  match?: any;
  history?: any;
}
export interface ListingsInProgressContainerReduxProps {
  useGraphQL: boolean;
}
export interface ListingsInProgressState {
  increment: number;
}
const LISTINGS_QUERY = gql`
  query($activeChallenge: Boolean!, $currentApplication: Boolean!) {
    listings(activeChallenge: $activeChallenge, currentApplication: $currentApplication) {
      ...ListingFragment
    }
  }
  ${LISTING_FRAGMENT}
`;
class ListingsInProgressContainer extends React.Component<
  ListingsInProgressContainerReduxProps & ListingsInProgressProps,
  ListingsInProgressState
> {
  constructor(props: ListingsInProgressContainerReduxProps & ListingsInProgressProps) {
    super(props);
    this.state = { increment: 0 };
  }
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query
          query={LISTINGS_QUERY}
          variables={{ activeChallenge: true, currentApplication: true }}
          pollInterval={1000}
        >
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <></>;
            }
            if (error) {
              return <p>Error :</p>;
            }
            const map = Set<any>(data.listings);
            const allListings: Set<NewsroomListing> = map
              .map(listing => {
                console.log("listing: ", listing);
                return {
                  listing: transformGraphQLDataIntoListing(listing, listing!.contractAddress),
                  newsroom: transformGraphQLDataIntoNewsroom(listing, listing!.contractAddress),
                };
              })
              .toSet();

            let soonestExpiry = Number.MAX_SAFE_INTEGER;
            allListings.forEach(listing => {
              const expiry = getNextTimerExpiry(listing!.listing.data);
              if (expiry > 0 && expiry < soonestExpiry) {
                soonestExpiry = expiry;
              }
            });
            const nowSeconds = Date.now() / 1000;
            const delaySeconds = soonestExpiry - nowSeconds;
            setTimeout(this.onTimerExpiry, delaySeconds * 1000);

            const applications = allListings.filter(listing => isInApplicationPhase(listing!.listing.data)).toSet();

            const readyToWhitelistListings = allListings
              .filter(listing => canBeWhitelisted(listing!.listing.data))
              .toSet();

            const inChallengeCommitListings = allListings
              .filter(listing => isInChallengedCommitVotePhase(listing!.listing.data))
              .toSet();

            const inChallengeRevealListings = allListings
              .filter(listing => isInChallengedRevealVotePhase(listing!.listing.data))
              .toSet();

            const awaitingAppealRequestListings = allListings
              .filter(listing => isAwaitingAppealRequest(listing!.listing.data))
              .toSet();

            const awaitingAppealJudgmentListings = allListings
              .filter(listing => isListingAwaitingAppealJudgment(listing!.listing.data))
              .toSet();

            const awaitingAppealChallengeListings = allListings
              .filter(listing => isListingAwaitingAppealChallenge(listing!.listing.data))
              .toSet();

            const appealChallengeCommitPhaseListings = allListings
              .filter(listing => isInAppealChallengeCommitPhase(listing!.listing.data))
              .toSet();

            const appealChallengeRevealPhaseListings = allListings
              .filter(listing => isInAppealChallengeRevealPhase(listing!.listing.data))
              .toSet();

            const resolveChallengeListings = allListings
              .filter(listing => canChallengeBeResolved(listing!.listing.data))
              .toSet();

            const resolveAppealListings = allListings
              .filter(listing => canListingAppealBeResolved(listing!.listing.data))
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
    } else {
      return <ListingsInProgressRedux {...this.props} />;
    }
  }
  public onTimerExpiry = (): void => {
    this.setState({ increment: this.state.increment + 1 });
  };
}

const mapStateToProps = (
  state: State,
  ownProps: ListingsInProgressProps,
): ListingsInProgressContainerReduxProps & ListingsInProgressProps => {
  const useGraphQL = state.useGraphQL;

  return {
    useGraphQL,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingsInProgressContainer);
