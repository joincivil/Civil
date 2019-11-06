import * as React from "react";
import { DashboardActivitySelectableItem } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ClaimRewardsItemOwnProps, ClaimRewardsViewComponentProps, ProposalClaimRewardsComponentProps } from "./types";

export const ClaimRewardsViewComponent: React.FunctionComponent<
  ClaimRewardsItemOwnProps & ClaimRewardsViewComponentProps
> = props => {
  const { challengeID, appealChallengeID, toggleSelect, newsroomName, userChallengeData, unclaimedRewardAmount } = props;
  let salt;
  if (userChallengeData) {
    salt = userChallengeData.salt;
  }

  if (!(newsroomName && (challengeID || appealChallengeID))) {
    return null;
  }

  const viewProps = {
    title: newsroomName,
    challengeID,
    appealChallengeID,
    salt,
    numTokens: getFormattedTokenBalance(unclaimedRewardAmount!),
    toggleSelect,
  };

  return <DashboardActivitySelectableItem {...viewProps} />;
};

export const ProposalClaimRewardsViewComponent: React.FunctionComponent<
  ClaimRewardsItemOwnProps & ProposalClaimRewardsComponentProps
> = props => {
  const { proposal, challengeID, unclaimedRewardAmount, userChallengeData, toggleSelect } = props;
  let salt;
  if (userChallengeData) {
    salt = userChallengeData.salt;
  }

  let title = "Parameter Proposal Challenge";
  if (proposal) {
    title = `${title}: ${proposal.paramName} = ${proposal.propValue}`;
  }

  const viewProps = {
    title,
    challengeID,
    salt,
    numTokens: getFormattedTokenBalance(unclaimedRewardAmount!),
    toggleSelect,
  };

  return <DashboardActivitySelectableItem {...viewProps} />;
};
