import * as React from "react";
import {
  StyledDashboardActivityItem,
  StyledChallengeIDKicker,
  StyledItemCheckboxContainer,
  StyledDashboardActivityItemDetails,
  StyledNewsroomName,
  StyledNumTokensContainer,
} from "./styledComponents";

export interface DashboardActivitySelectableItemProps {
  newsroomName: string;
  numTokens: string;
  challengeID?: string;
  appealChallengeID?: string;
  salt?: any;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: any): void;
}

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
        <StyledNewsroomName>{props.newsroomName}</StyledNewsroomName>
        {props.children}
      </StyledDashboardActivityItemDetails>

      <StyledNumTokensContainer>+{props.numTokens}</StyledNumTokensContainer>
    </StyledDashboardActivityItem>
  );
};
