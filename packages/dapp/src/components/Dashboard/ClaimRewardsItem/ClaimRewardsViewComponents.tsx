import * as React from "react";
import { DashboardActivitySelectableItem } from "@joincivil/components";
import { ClaimRewardsItemOwnProps, ClaimRewardsViewComponentProps, ProposalClaimRewardsComponentProps } from "./types";

export const ClaimRewardsViewComponent: React.FunctionComponent<ClaimRewardsItemOwnProps & ClaimRewardsViewComponentProps> = props => {
  const { challengeID, appealChallengeID, toggleSelect, newsroom, userChallengeData, unclaimedRewardAmount } = props;
  let salt;
  if (userChallengeData) {
    salt = userChallengeData.salt;
  }

  if (!(newsroom && (challengeID || appealChallengeID))) {
    return null;
  }

  const newsroomData = newsroom.wrapper.data;

  const viewProps = {
    title: newsroomData.name,
    challengeID,
    appealChallengeID,
    salt,
    numTokens: unclaimedRewardAmount!,
    toggleSelect,
  };

  return <DashboardActivitySelectableItem {...viewProps} />;
}

export const ProposalClaimRewardsViewComponent: React.FunctionComponent<ClaimRewardsItemOwnProps & ProposalClaimRewardsComponentProps> = props => {
  const { proposal, challenge, challengeDataRequestStatus, challengeID, unclaimedRewardAmount, proposalUserChallengeData, toggleSelect } = props;
  let salt;
  if (proposalUserChallengeData) {
    salt = proposalUserChallengeData.salt;
  }

  // if (!challenge && !challengeDataRequestStatus) {
  //   this.props.dispatch!(fetchAndAddParameterProposalChallengeData(challengeID! as string));
  // }

  let title = "Parameter Proposal Challenge";
  if (proposal) {
    title = `${title}: ${proposal.paramName} = ${proposal.propValue}`;
  }

  const viewProps = {
    title,
    challengeID,
    salt,
    numTokens: unclaimedRewardAmount!,
    toggleSelect,
  };

  return <DashboardActivitySelectableItem {...viewProps} />;
}
