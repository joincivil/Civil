import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { State } from "../../redux/reducers";
import ListingsInProgressRedux from "./ListingsInProgressRedux";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { transformGraphQLDataIntoListing } from "../../helpers/queryTransformations";
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
      contractAddress
      name
      owner
      ownerAddresses
      whitelisted
      charter {
        uri
        contentID
        revisionID
        signature
        author
        contentHash
        timestamp
      }
      unstakedDeposit
      appExpiry
      approvalDate
      challengeID
      challenge {
        challengeID
        listingAddress
        statement
        rewardPool
        challenger
        resolved
        stake
        totalTokens
        poll {
          commitEndDate
          revealEndDate
          voteQuorum
          votesFor
          votesAgainst
        }
        requestAppealExpiry
        lastUpdatedDateTs
        appeal {
          requester
          appealFeePaid
          appealPhaseExpiry
          appealGranted
          appealOpenToChallengeExpiry
          statement
          appealChallengeID
          appealChallenge {
            challengeID
            statement
            rewardPool
            challenger
            resolved
            stake
            totalTokens
            poll {
              commitEndDate
              revealEndDate
              voteQuorum
              votesFor
              votesAgainst
            }
          }
        }
      }
    }
  }
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
            const allListings = map.map(listing => {
              const transformed = transformGraphQLDataIntoListing(listing, listing!.contractAddress);
              return transformed;
            });

            let soonestExpiry = Number.MAX_SAFE_INTEGER;
            allListings.forEach(listing => {
              const expiry = getNextTimerExpiry(listing!.data);
              if (expiry > 0 && expiry < soonestExpiry) {
                soonestExpiry = expiry;
              }
            });
            const nowSeconds = Date.now() / 1000;
            const delaySeconds = soonestExpiry - nowSeconds;
            setTimeout(this.onTimerExpiry, delaySeconds * 1000);

            const applications = allListings
              .filter(listing => isInApplicationPhase(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const readyToWhitelistListings = allListings
              .filter(listing => canBeWhitelisted(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const inChallengeCommitListings = allListings
              .filter(listing => isInChallengedCommitVotePhase(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const inChallengeRevealListings = allListings
              .filter(listing => isInChallengedRevealVotePhase(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const awaitingAppealRequestListings = allListings
              .filter(listing => isAwaitingAppealRequest(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const awaitingAppealJudgmentListings = allListings
              .filter(listing => isListingAwaitingAppealJudgment(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const awaitingAppealChallengeListings = allListings
              .filter(listing => isListingAwaitingAppealChallenge(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const appealChallengeCommitPhaseListings = allListings
              .filter(listing => isInAppealChallengeCommitPhase(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const appealChallengeRevealPhaseListings = allListings
              .filter(listing => isInAppealChallengeRevealPhase(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const resolveChallengeListings = allListings
              .filter(listing => canChallengeBeResolved(listing!.data))
              .map(listing => listing!.address)
              .toSet();

            const resolveAppealListings = allListings
              .filter(listing => canListingAppealBeResolved(listing!.data))
              .map(listing => listing!.address)
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
