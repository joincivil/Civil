import * as React from "react";

import {
  transformGraphQLDataIntoChallenge,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemWrapperReduxProps } from "./MyTasksProposalItemTypes";

import MyTasksProposalItemComponent from "./MyTasksProposalItemComponent";

const MyTasksProposalItemWrapper: React.FunctionComponent<
  MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps
> = props => {
  const { challengeID, queryUserChallengeData, showClaimRewardsTab, showRescueTokensTab } = props;

  if (!queryUserChallengeData) {
    console.error("MyTasksProposalItemWrapper: no queryUserChallengeData found");
    return <></>;
  }
  const { pollType, challenge } = queryUserChallengeData;
  if (!pollType) {
    console.error("MyTasksProposalItemWrapper: no pollType found");
    return <></>;
  }

  if (pollType === "PARAMETER_PROPOSAL_CHALLENGE") {
    if (challenge) {
      const userChallengeData = transfromGraphQLDataIntoUserChallengeData(
        queryUserChallengeData,
        challenge,
      );
      const challengeData = transformGraphQLDataIntoChallenge(challenge);

      const viewProps = {
        challengeID,
        challenge: challengeData,
        userChallengeData,
        showClaimRewardsTab,
        showRescueTokensTab,
      };

      return <MyTasksProposalItemComponent {...viewProps} />;
    }
  }
  console.warn("MyTasksProposalItemWrapper: pollType !== CHALLENGE");
  return <></>;

};

export default MyTasksProposalItemWrapper;
