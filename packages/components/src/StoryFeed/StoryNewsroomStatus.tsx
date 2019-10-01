import * as React from "react";
import { StoryNewsroomStatusStyled } from "./StoryFeedStyledComponents";
import { colors } from "../styleConstants";
import { StoryNewsroomData } from "./types";

export interface StoryNewsroomStatusProps {
  newsroom: StoryNewsroomData;
  activeChallenge: boolean;
  handleOpenNewsroom(): void;
}

export const StoryNewsroomStatus: React.FunctionComponent<StoryNewsroomStatusProps> = props => {
  return (
    <StoryNewsroomStatusStyled>
      <a onClick={props.handleOpenNewsroom}>
        {props.newsroom.charter.name}
        {/* TODO(suddy) get approved/challenged icons */}
        {props.activeChallenge ? (
          <svg height="14" width="14">
            <circle cx="7" cy="7" r="7" fill={colors.accent.CIVIL_YELLOW} />
          </svg>
        ) : (
          <svg height="14" width="14">
            <circle cx="7" cy="7" r="7" fill={colors.accent.CIVIL_TEAL} />
          </svg>
        )}
      </a>
    </StoryNewsroomStatusStyled>
  );
};
