import * as React from "react";
import { Query } from "react-apollo";

import {
  CHALLENGE_QUERY,
  LISTING_QUERY,
  transformGraphQLDataIntoNewsroom,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { RescueTokensItemOwnProps } from "./types";
import { RescueTokensViewComponent, ProposalRescueTokensViewComponent } from "./RescueTokensViewComponents";

const RescueTokensItemApolloQueryWrapper: React.FunctionComponent<RescueTokensItemOwnProps> = props => {
  const { challengeID, appealChallengeID, queryUserChallengeData, toggleSelect, isProposalChallenge } = props;
  const challengeIDArg = challengeID || appealChallengeID;
  if (!challengeIDArg) {
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

              const viewProps = {
                challengeID,
                appealChallengeID,
                userChallengeData,
                toggleSelect,
              };

              if (isProposalChallenge) {
                return <ProposalRescueTokensViewComponent {...viewProps} />;
              }

              const newsroom = { wrapper: transformGraphQLDataIntoNewsroom(listingData.listing, listingAddress) };
              return <RescueTokensViewComponent {...viewProps} listingAddress={listingAddress} newsroom={newsroom} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default RescueTokensItemApolloQueryWrapper;
