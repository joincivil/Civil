import * as React from "react";

import { DashboardActivitySelectableItemProps } from "./DashboardTypes";
import DashboardActivityItemTitle from "./DashboardActivityItemTitle";
import {
  StyledDashboardActivityItem,
  StyledChallengeIDKicker,
  StyledItemCheckboxContainer,
  StyledDashboardActivityItemDetails,
  StyledNumTokensContainer,
} from "./DashboardStyledComponents";

const ItemCheckbox: React.SFC<DashboardActivitySelectableItemProps> = props => {
  const challengeID = props.appealChallengeID || props.challengeID;
  const handleChange = (event: any) => {
    props.toggleSelect!(challengeID!, event.target.checked, props.salt);
  };
  return <input type="checkbox" onChange={handleChange} />;
};

export const DashboardActivitySelectableItem: React.SFC<DashboardActivitySelectableItemProps> = props => {
  if (props.challengeID && props.appealChallengeID) {
    throw new Error("DashboardActivitySelectableItem: cannot have both challengeID and appealChallengeID props");
  }

  let challengeIDDisplay = "Challenge";
  if (props.challengeID) {
    challengeIDDisplay = `Challenge #${props.challengeID}`;
  } else if (props.appealChallengeID) {
    challengeIDDisplay = `Appeal Challenge #${props.appealChallengeID}`;
  }

  return (
    <StyledDashboardActivityItem>
      <StyledItemCheckboxContainer>{props.toggleSelect && ItemCheckbox(props)}</StyledItemCheckboxContainer>

      <StyledDashboardActivityItemDetails>
        <StyledChallengeIDKicker>{challengeIDDisplay}</StyledChallengeIDKicker>
        <DashboardActivityItemTitle title={props.title} viewDetailURL={props.viewDetailURL} />
        {props.children}
      </StyledDashboardActivityItemDetails>

      <StyledNumTokensContainer>+{props.numTokens}</StyledNumTokensContainer>
    </StyledDashboardActivityItem>
  );
};
