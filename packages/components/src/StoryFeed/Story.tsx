import * as React from "react";
import { StoryLink, StoryTitle, StoryImgSquare, TimeStamp } from "./StoryFeedStyledComponents";

export interface StoryProps {
  img: string;
  timeStamp: string;
  title: string;
  url: string;
}

export const Story: React.FunctionComponent<StoryProps> = props => {
  return (
    <>
      <StoryLink href={props.url} target="_blank">
        <StoryTitle>{props.title}</StoryTitle>
        <StoryImgSquare>
          <img src={props.img} />
        </StoryImgSquare>
        <TimeStamp>{props.timeStamp}</TimeStamp>
      </StoryLink>
    </>
  );
};
