import * as React from "react";
import { Query } from "react-apollo";
import BigNumber from "bignumber.js";

import {
  CHALLENGE_QUERY,
  LISTING_QUERY,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoChallenge,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { ClaimRewardsItemOwnProps } from "./types";
import { ClaimRewardsViewComponent, ProposalClaimRewardsViewComponent } from "./ClaimRewardsViewComponents";

const ClaimRewardsItemApolloQueryWrapper: React.FunctionComponent<ClaimRewardsItemOwnProps > = props => {
  const { challengeID, appealChallengeID, queryUserChallengeData, queryUserAppealChallengeData } = props;
  const challengeIDArg = challengeID || appealChallengeID;
  if (!challengeIDArg) {
    console.log("missing challenge id", props);
    return <></>;
  }

  return (
    <Query query={CHALLENGE_QUERY} variables={{ challengeID: challengeIDArg }}>
      {({ loading, error, data: graphQLChallengeData }: any) => {
        if (error || loading || !graphQLChallengeData) {
          return <></>;
        }
        const listingAddress = graphQLChallengeData.challenge.listingAddress;

        return (
          <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
            {({ loading: listingLoading, error: listingError, data: listingData }: any): JSX.Element => {
              if (listingLoading || listingError || !listingData) {
                return <></>;
              }

              const userChallengeData = transfromGraphQLDataIntoUserChallengeData(
                queryUserChallengeData,
                graphQLChallengeData.challenge,
              );
              const challenge = transformGraphQLDataIntoChallenge(graphQLChallengeData.challenge);
              const listing = transformGraphQLDataIntoListing(listingData.listing, listingAddress);
              const newsroom = { wrapper: transformGraphQLDataIntoNewsroom(listingData.listing, listingAddress) };

              let appealUserChallengeData;
              if (queryUserAppealChallengeData) {
                appealUserChallengeData = transfromGraphQLDataIntoUserChallengeData(
                  queryUserAppealChallengeData,
                  graphQLChallengeData.challenge.appeal.appealChallenge,
                );
              }

              const wrappedChallenge = {
                listingAddress,
                challengeID: new BigNumber(props.challengeID!),
                challenge,
              };
              const unclaimedRewardAmount = userChallengeData!.voterReward;

              const viewProps = {
                challengeID,
                challenge: wrappedChallenge,
                userChallengeData,
                unclaimedRewardAmount,
              };

              if (props.isProposalChallenge) {
                return <ProposalClaimRewardsViewComponent {...viewProps} />;
              }

              return <ClaimRewardsViewComponent {...viewProps} listingAddress={listingAddress} newsroom={newsroom} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default ClaimRewardsItemApolloQueryWrapper;
