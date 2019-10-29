import * as React from "react";
import { StoryNewsroomStatusStyled } from "./StoryFeedStyledComponents";
import { ChallengeMarkIcon, TrustMarkIcon } from "@joincivil/elements";

export interface StoryNewsroomStatusProps {
  newsroomName: string;
  activeChallenge: boolean;
  handleOpenNewsroom?(): void;
}

export const StoryNewsroomStatus: React.FunctionComponent<StoryNewsroomStatusProps> = props => {
  if (props.handleOpenNewsroom) {
    return (
      <StoryNewsroomStatusStyled>
        <a onClick={props.handleOpenNewsroom}>
          {props.newsroomName}
          {props.activeChallenge ? (
            <ChallengeMarkIcon width={18} height={18} />
          ) : (
            <TrustMarkIcon width={18} height={18} />
          )}
        </a>
      </StoryNewsroomStatusStyled>
    );
  }

  return (
    <StoryNewsroomStatusStyled>
      {props.newsroomName}
      {props.activeChallenge ? <ChallengeMarkIcon width={18} height={18} /> : <TrustMarkIcon width={18} height={18} />}
    </StoryNewsroomStatusStyled>
  );
};
