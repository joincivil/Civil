import * as React from "react";
import {
  StoryTitle,
  TimeStamp,
  StoryDescription,
  StoryImgWide,
  StoryCardFooter,
  ReadMoreBtn,
} from "./StoryfeedStyledComponents";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Button } from "../Button";
import { Share } from "../Social";

export interface StoryDescriptionCardProps {
  description: string;
  img: string;
  newsroom: string;
  timeStamp: string;
  title: string;
  url: string;
}

export const StoryDescriptionCard: React.FunctionComponent<StoryDescriptionCardProps> = props => {
  return (
    <>
      <>
        <StoryImgWide>
          <img src={props.img} />
        </StoryImgWide>
      </>
      <StoryTitle>{props.title}</StoryTitle>
      <>
        <StoryNewsroomStatus newsroom={props.newsroom} activeChallenge={true} />
        <TimeStamp>{props.timeStamp}</TimeStamp>
      </>
      <StoryDescription>{props.description}</StoryDescription>
      <>Recent Contributors Component</>
      <Share />
      <StoryCardFooter>
        <Button>Tips</Button>
        <ReadMoreBtn>Read More</ReadMoreBtn>
      </StoryCardFooter>
    </>
  );
};
