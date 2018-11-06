import * as React from "react";
import { connect } from "react-redux";
import { Set } from "immutable";
import { ListingSummaryApprovedComponent } from "@joincivil/components";
import ListingList from "./ListingList";
import { State } from "../../redux/reducers";
import WhitelistedListingListRedux from "./WhitelistedListingListRedux";
import { EmptyRegistryTabContentComponent, REGISTRY_PHASE_TAB_TYPES } from "./EmptyRegistryTabContent";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { NewsroomListing } from "@joincivil/core";
import { transformGraphQLDataIntoListing, transformGraphQLDataIntoNewsroom } from "../../helpers/queryTransformations";

export interface WhitelistedListingsListContainerReduxProps {
  useGraphQL: boolean;
}
const LISTINGS_QUERY = gql`
  query($whitelistedOnly: Boolean!) {
    listings(whitelistedOnly: $whitelistedOnly) {
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
class WhitelistedListingListContainer extends React.Component<WhitelistedListingsListContainerReduxProps> {
  public render(): JSX.Element {
    if (this.props.useGraphQL) {
      return (
        <Query query={LISTINGS_QUERY} variables={{ whitelistedOnly: true }} pollInterval={1000}>
          {({ loading, error, data }: any): JSX.Element => {
            if (loading) {
              return <></>;
            }
            if (error) {
              return <p>Error :</p>;
            }
            const map = Set<NewsroomListing>(
              data.listings.map((listing: any) => {
                return {
                  listing: transformGraphQLDataIntoListing(listing, listing.contractAddress),
                  newsroom: transformGraphQLDataIntoNewsroom(listing, listing.contractAddress),
                };
              }),
            );

            if (!map.count()) {
              return <EmptyRegistryTabContentComponent phaseTabType={REGISTRY_PHASE_TAB_TYPES.APPROVED} />;
            }

            return (
              <>
                <ListingList ListingItemComponent={ListingSummaryApprovedComponent} listings={map} />
              </>
            );
          }}
        </Query>
      );
    } else {
      return <WhitelistedListingListRedux />;
    }
  }
}

const mapStateToProps = (state: State): WhitelistedListingsListContainerReduxProps => {
  const useGraphQL = state.useGraphQL;

  return {
    useGraphQL,
  };
};

export default connect(mapStateToProps)(WhitelistedListingListContainer);
