import * as React from "react";
import { StoryLink, StoryLinkLeft, StoryTitle, StoryImgSquare, TimeStamp } from "./StoryFeedStyledComponents";

export interface StoryProps {
  img: string;
  timeStamp: string;
  title: string;
  handleOpenStory(): void;
}

export const Story: React.FunctionComponent<StoryProps> = props => {
  return (
    <>
      <StoryLink onClick={props.handleOpenStory}>
        <StoryLinkLeft>
          <StoryTitle>{props.title}</StoryTitle>
          <TimeStamp>{props.timeStamp}</TimeStamp>
        </StoryLinkLeft>
        <StoryImgSquare>
          <img src={props.img} />
        </StoryImgSquare>
      </StoryLink>
    </>
  );
};
