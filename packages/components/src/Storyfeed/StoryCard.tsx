import * as React from "react";
import { StoryLink, StoryTitle, StoryImgSquare, TimeStamp } from "./StoryfeedStyledComponents";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";

export interface StoryCardProps {
  img: string;
  newsroom: string;
  timeStamp: string;
  title: string;
  url: string;
}

export const StoryCard: React.FunctionComponent<StoryCardProps> = props => {
  return (
    <>
      <StoryNewsroomStatus newsroom={props.newsroom} activeChallenge={true} />
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
