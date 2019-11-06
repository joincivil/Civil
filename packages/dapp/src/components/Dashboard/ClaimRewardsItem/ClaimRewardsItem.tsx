import * as React from "react";
import { ClaimRewardsItemOwnProps } from "./types";
import ClaimRewardsItemWrapper from "./ClaimRewardsItemWrapper";

const ClaimRewardsItem: React.FunctionComponent<ClaimRewardsItemOwnProps> = props => {
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
    <ClaimRewardsItemWrapper
      {...viewProps}
      queryUserChallengeData={queryUserChallengeData}
      queryUserAppealChallengeData={queryUserAppealChallengeData}
    />
  );
};

export default ClaimRewardsItem;
