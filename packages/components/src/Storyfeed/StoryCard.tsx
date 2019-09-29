import * as React from "react";
import { StoryCardLink, StoryCardTitle, StoryCardImg, TimeStamp } from "./StoryfeedStyledComponents";

export interface StoryCardProps {
  img: string;
  timeStamp: string;
  title: string;
  url: string;
}

export const StoryCard: React.FunctionComponent<StoryCardProps> = props => {
  return (
    <StoryCardLink href={props.url} target="_blank">
      <StoryCardTitle>{props.title}</StoryCardTitle>
      <StoryCardImg>
        <img src={props.img} />
      </StoryCardImg>
      <TimeStamp>{props.timeStamp}</TimeStamp>
    </StoryCardLink>
  );
};
