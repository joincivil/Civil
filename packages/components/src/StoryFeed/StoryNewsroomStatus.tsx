import * as React from "react";
import { StoryNewsroomStatusStyled } from "./StoryFeedStyledComponents";
import { ChallengeMarkIcon, TrustMarkIcon } from "@joincivil/elements";
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
        {props.activeChallenge ? (
          <ChallengeMarkIcon width={20} height={20} />
        ) : (
          <TrustMarkIcon width={20} height={20} />
        )}
      </a>
    </StoryNewsroomStatusStyled>
  );
};
