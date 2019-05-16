import * as React from "react";
import { Query } from "react-apollo";

import {
  CHALLENGE_QUERY,
  transformGraphQLDataIntoChallenge,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemWrapperReduxProps } from "./MyTasksProposalItemTypes";

import MyTasksProposalItemComponent from "./MyTasksProposalItemComponent";

const MyTasksProposalItemApolloQueryWrapper: React.FunctionComponent<
  MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps
> = props => {
  const { challengeID, queryUserChallengeData, showClaimRewardsTab, showRescueTokensTab } = props;

  return (
    <Query query={CHALLENGE_QUERY} variables={{ challengeID }}>
      {({ loading, error, data: graphQLChallengeData }: any) => {
        if (loading || error || !graphQLChallengeData) {
          return <></>;
        }

        const userChallengeData = transfromGraphQLDataIntoUserChallengeData(
          queryUserChallengeData,
          graphQLChallengeData.challenge,
        );
        const challenge = transformGraphQLDataIntoChallenge(graphQLChallengeData.challenge);

        const viewProps = {
          challengeID,
          challenge,
          userChallengeData,
          showClaimRewardsTab,
          showRescueTokensTab,
        };

        return <MyTasksProposalItemComponent {...viewProps} />;
      }}
    </Query>
  );
};

export default MyTasksProposalItemApolloQueryWrapper;
