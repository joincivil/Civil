import * as React from "react";
import { ClaimRewardsItemOwnProps } from "./types";
import ClaimRewardsItemApolloQueryWrapper from "./ClaimRewardsApolloQueryWrapper";

const ClaimRewardsItemWrapper: React.FunctionComponent<
  ClaimRewardsItemOwnProps
> = props => {
  const {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    toggleSelect,
  } = props;

  const viewProps = {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    toggleSelect,
  };

  return (
    <ClaimRewardsItemApolloQueryWrapper
      {...viewProps}
      queryUserChallengeData={queryUserChallengeData}
      queryUserAppealChallengeData={queryUserAppealChallengeData}
    />
  );
}

export default ClaimRewardsItemWrapper;
