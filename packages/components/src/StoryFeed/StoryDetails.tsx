import * as React from "react";
import {
  StoryTitle,
  TimeStamp,
  StoryDescription,
  StoryImgWide,
  StoryFooter,
  ReadMoreBtn,
} from "./StoryFeedStyledComponents";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Button } from "../Button";
import { Share } from "../Social";

export interface StoryDetailsProps {
  description: string;
  img: string;
  newsroom: string;
  timeStamp: string;
  title: string;
  url: string;
}

export const StoryDetails: React.FunctionComponent<StoryDetailsProps> = props => {
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
      <StoryFooter>
        <Button>Tips</Button>
        <ReadMoreBtn>Read More</ReadMoreBtn>
      </StoryFooter>
    </>
  );
};
