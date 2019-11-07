import * as React from "react";

import {
  transformGraphQLDataIntoNewsroom,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../../helpers/queryTransformations";
import { ClaimRewardsItemOwnProps } from "./types";
import { ClaimRewardsViewComponent, ProposalClaimRewardsViewComponent } from "./ClaimRewardsViewComponents";

const ClaimRewardsItemWrapper: React.FunctionComponent<ClaimRewardsItemOwnProps> = props => {
  const { challengeID, appealChallengeID, queryUserChallengeData, toggleSelect, isProposalChallenge } = props;
  const challengeIDArg = challengeID || appealChallengeID;
  if (!challengeIDArg) {
    return <></>;
  }

  if (!queryUserChallengeData) {
    console.error("ClaimRewardsItemWrapper: no queryUserChallengeData found");
    return <></>;
  }
  const { pollType, challenge } = queryUserChallengeData;
  if (!pollType) {
    console.error("ClaimRewardsItemWrapper: no pollType found");
    return <></>;
  }

  if (pollType === "CHALLENGE" || pollType === "APPEAL_CHALLENGE" || pollType === "PARAMETER_PROPOSAL_CHALLENGE") {
    if (challenge) {

      const userChallengeData = transfromGraphQLDataIntoUserChallengeData(
        queryUserChallengeData,
        challenge,
      );

      const unclaimedRewardAmount = userChallengeData!.voterReward;

      const viewProps = {
        challengeID,
        appealChallengeID,
        userChallengeData,
        unclaimedRewardAmount,
        toggleSelect,
      };

      if (isProposalChallenge) {
        return <ProposalClaimRewardsViewComponent {...viewProps} />;
      }

      const listingAddress = challenge!.listingAddress;
      if (listingAddress && challenge.listing) {
        const newsroom = { wrapper: transformGraphQLDataIntoNewsroom(challenge.listing, listingAddress) };
        return <ClaimRewardsViewComponent {...viewProps} listingAddress={listingAddress} newsroom={newsroom} />;
      }
    }
  }
  console.warn("ClaimRewardsItemWrapper: pollType unknown");
  return <></>;
};

export default ClaimRewardsItemWrapper;
