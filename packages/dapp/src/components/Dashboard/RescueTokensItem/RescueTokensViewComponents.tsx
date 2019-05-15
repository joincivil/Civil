import * as React from "react";
import { DashboardActivitySelectableItem } from "@joincivil/components";
import { RescueTokensItemOwnProps, RescueTokensViewComponentProps, ProposalRescueTokensComponentProps } from "./types";

export const RescueTokensViewComponent: React.FunctionComponent<
  RescueTokensItemOwnProps & RescueTokensViewComponentProps
> = props => {
  const { challengeID, appealChallengeID, toggleSelect, newsroom, userChallengeData } = props;
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
    toggleSelect,
  };

  return <DashboardActivitySelectableItem {...viewProps} />;
};

export const ProposalRescueTokensViewComponent: React.FunctionComponent<
  RescueTokensItemOwnProps & ProposalRescueTokensComponentProps
> = props => {
  const { proposal, challengeID, userChallengeData, toggleSelect } = props;

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
    toggleSelect,
  };

  return <DashboardActivitySelectableItem {...viewProps} />;
};
