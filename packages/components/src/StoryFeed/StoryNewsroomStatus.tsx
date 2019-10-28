import * as React from "react";
import { StoryNewsroomStatusStyled } from "./StoryFeedStyledComponents";
import { ChallengeMarkIcon, TrustMarkIcon } from "@joincivil/elements";

export interface StoryNewsroomStatusProps {
  newsroomName: string;
  activeChallenge: boolean;
  handleOpenNewsroom?(): void;
}

export const StoryNewsroomStatus: React.FunctionComponent<StoryNewsroomStatusProps> = props => {
  const content = () => (
    <>
      {props.newsroomName}
      {props.activeChallenge ? <ChallengeMarkIcon width={18} height={18} /> : <TrustMarkIcon width={18} height={18} />}
    </>
  );

  return (
    <StoryNewsroomStatusStyled>
      {props.handleOpenNewsroom ? <a onClick={props.handleOpenNewsroom}>{content}</a> : <>{content}</>}
    </StoryNewsroomStatusStyled>
  );
};
