import * as React from "react";

import { buttonSizes, InvertedButton } from "../Button";

import { DashboardActivityItemCTAButtonProps } from "./DashboardTypes";
// import { StyledDashboardActivityItemTitle } from "./styledComponents";

const DashboardActivityItemCTAButton: React.SFC<DashboardActivityItemCTAButtonProps> = props => {
  const {
    listingDetailURL,
    inChallengeCommitVotePhase,
    inChallengeRevealPhase,
    isAwaitingAppealRequest,
    canResolveChallenge,
    isAwaitingAppealChallenge,
    canListingAppealBeResolved,
    isInAppealChallengeCommitPhase,
    isInAppealChallengeRevealPhase,
    canListingAppealChallengeBeResolved,
    didUserCommit,
    canUserCollect,
    canUserRescue,
    onClick,
  } = props;

  let buttonText;

  if (inChallengeCommitVotePhase || isInAppealChallengeCommitPhase && didUserCommit) {
    buttonText = "Change Vote";
  } else if (inChallengeRevealPhase || isInAppealChallengeRevealPhase) {
    buttonText = "Reveal Vote";
  } else if (isAwaitingAppealRequest) {
    buttonText = "Request Appeal";
  } else if (canResolveChallenge) {
    buttonText = "Resolve Challenge";
  } else if (isAwaitingAppealChallenge) {
    buttonText = "Challenge Granted Appeal";
  } else if (isAwaitingAppealChallenge) {
    buttonText = "Resolve Appeal";
  } else if (canUserCollect) {
    buttonText = "Claim Rewards";
  } else if (canUserRescue) {
    buttonText = "Rescue Tokens";
  }
  console.log(props);

  if ((!listingDetailURL && !onClick) || !buttonText) {
    return <></>;
  }

  let actionProp = {};
  if (listingDetailURL) {
    actionProp = { to: listingDetailURL };
  } else if (onClick) {
    actionProp = { onClick };
  }

  return (
    <InvertedButton {...actionProp} size={buttonSizes.SMALL}>
      {buttonText}
    </InvertedButton>
  );
};

export default DashboardActivityItemCTAButton;
