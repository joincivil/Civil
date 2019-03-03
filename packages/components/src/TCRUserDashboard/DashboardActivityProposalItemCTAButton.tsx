import * as React from "react";

import { buttonSizes, InvertedButton } from "../Button";

import { DashboardActivityItemProposalCTAButtonProps } from "./DashboardTypes";

export const DashboardActivityProposalItemCTAButton: React.SFC<DashboardActivityItemProposalCTAButtonProps> = props => {
  const { propDetailURL, canUserReveal, canUserCollect, canUserRescue, onClick } = props;

  let buttonText;

  if (canUserReveal) {
    buttonText = "Reveal Vote";
  } else if (canUserCollect) {
    buttonText = "Claim Rewards";
  } else if (canUserRescue) {
    buttonText = "Rescue Tokens";
  } else {
    buttonText = "Change Vote";
  }

  if ((!propDetailURL && !onClick) || !buttonText) {
    return <></>;
  }

  let actionProp = {};
  if (onClick) {
    actionProp = { onClick };
  } else if (propDetailURL) {
    actionProp = { to: propDetailURL };
  }

  return (
    <InvertedButton {...actionProp} size={buttonSizes.SMALL}>
      {buttonText}
    </InvertedButton>
  );
};
