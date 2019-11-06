import * as React from "react";
import { ClaimRewardsItemOwnProps } from "./types";
import { ProposalClaimRewardsViewComponent, ClaimRewardsViewComponent } from "./ClaimRewardsViewComponents";
import { BigNumber } from "@joincivil/typescript-types";

const ClaimRewardsItemWrapper: React.FunctionComponent<ClaimRewardsItemOwnProps> = props => {
  const {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    queryUserChallengeData,
    // queryUserAppealChallengeData,
    toggleSelect,
  } = props;

  console.log("claim rewards item props: ", props);

  if ((queryUserChallengeData!.pollType === "PARAMETER_PROPOSAL_CHALLENGE")) {
    console.log("in here!");
    const proposalViewProps = {
      challengeID,
      appealChallengeID,
      isProposalChallenge,
      toggleSelect,
      unclaimedRewardAmount: new BigNumber(queryUserChallengeData!.voterReward)
  };
    return <ProposalClaimRewardsViewComponent {...proposalViewProps} />;
  }

  console.log("out here.");
  const newsroomName = queryUserChallengeData && queryUserChallengeData.challenge && queryUserChallengeData.challenge.listing && queryUserChallengeData.challenge.listing.name;
  console.log("newsroom name: ", newsroomName);
  const unclaimedRewardAmount = new BigNumber(queryUserChallengeData && queryUserChallengeData.voterReward);
  console.log("unclaimedReward: ", unclaimedRewardAmount);
  const viewProps = {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    toggleSelect,
    unclaimedRewardAmount,
    newsroomName,
  };
  return <ClaimRewardsViewComponent {...viewProps}/>
};

export default ClaimRewardsItemWrapper;
