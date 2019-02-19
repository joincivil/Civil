import * as React from "react";

import { buttonSizes, InvertedButton } from "../Button";

import { DashboardActivityItemCTAButtonProps } from "./DashboardTypes";

export const DashboardActivityItemCTAButton: React.SFC<DashboardActivityItemCTAButtonProps> = props => {
  const {
    listingDetailURL,
    inCommitPhase,
    inRevealPhase,
    canRequestAppeal,
    canResolveChallenge,
    isAwaitingAppealChallenge,
    canListingAppealBeResolved,
    isAppealChallengeInCommitStage,
    isAppealChallengeInRevealStage,
    canListingAppealChallengeBeResolved,
    didUserCommit,
    didUserReveal,
    canUserCollect,
    canUserRescue,
    onClick,
  } = props;

  let buttonText;

  if (inCommitPhase) {
    buttonText = "Change Vote";
  } else if (isAppealChallengeInCommitStage && didUserCommit) {
    buttonText = "Commit Vote";
  } else if ((!didUserReveal && inRevealPhase) || isAppealChallengeInRevealStage) {
    buttonText = "Reveal Vote";
  } else if (canRequestAppeal) {
    buttonText = "Request Appeal";
  } else if (canResolveChallenge || canListingAppealChallengeBeResolved) {
    buttonText = "Resolve";
  } else if (isAwaitingAppealChallenge) {
    buttonText = "Challenge Appeal";
  } else if (canListingAppealBeResolved) {
    buttonText = "Resolve";
  } else if (canUserCollect) {
    buttonText = "Claim Rewards";
  } else if (canUserRescue) {
    buttonText = "Rescue Tokens";
  }

  if ((!listingDetailURL && !onClick) || !buttonText) {
    return <></>;
  }

  let actionProp = {};
  if (onClick) {
    actionProp = { onClick };
  } else if (listingDetailURL) {
    actionProp = { to: listingDetailURL };
  }

  return (
    <InvertedButton {...actionProp} size={buttonSizes.SMALL}>
      {buttonText}
    </InvertedButton>
  );
};
