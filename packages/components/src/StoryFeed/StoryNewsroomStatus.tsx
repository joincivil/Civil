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
          <ChallengeMarkIcon width={18} height={18} />
        ) : (
          <TrustMarkIcon width={18} height={18} />
        )}
      </a>
    </StoryNewsroomStatusStyled>
  );
};
