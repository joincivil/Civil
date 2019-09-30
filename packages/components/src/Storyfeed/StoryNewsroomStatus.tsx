import * as React from "react";
import { StoryNewsroomName } from "./StoryFeedStyledComponents";

export interface StoryNewsroomStatusProps {
  newsroom: string;
  activeChallenge: boolean;
}

export const StoryNewsroomStatus: React.FunctionComponent<StoryNewsroomStatusProps> = props => {
  return (
    <>
      <StoryNewsroomName>{props.newsroom}</StoryNewsroomName>
      {props.activeChallenge ? "challenge icon" : "whitelisted icon"}
    </>
  );
};
