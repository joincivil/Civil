import * as React from "react";
import {
  StoryTitle,
  TimeStamp,
  StoryDetailsFlex,
  StoryDescription,
  StoryImgWide,
  StoryModalFullBleedHeader,
  StoryModalContent,
  StoryModalFooter,
  BlueLinkBtn,
} from "./StoryFeedStyledComponents";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
// import { Share } from "../Social";
import { Leaderboard, ContributerCount, Contributers } from "../Leaderboard";

export interface StoryDetailsProps {
  activeChallenge: boolean;
  contributers: Contributers[];
  description: string;
  img: string;
  newsroom: string;
  timeStamp: string;
  title: string;
  total: number;
  url: string;
}

export const StoryDetails: React.FunctionComponent<StoryDetailsProps> = props => {
  return (
    <>
      <StoryModalFullBleedHeader>
        <StoryImgWide>
          <img src={props.img} />
        </StoryImgWide>
      </StoryModalFullBleedHeader>
      <StoryModalContent>
        <StoryTitle>{props.title}</StoryTitle>
        <StoryDetailsFlex>
          <StoryNewsroomStatus newsroom={props.newsroom} activeChallenge={props.activeChallenge} />
          <TimeStamp>{props.timeStamp}</TimeStamp>
        </StoryDetailsFlex>
        <StoryDescription>{props.description}</StoryDescription>
        <Leaderboard label={"Recent Contributers"} contributers={props.contributers} />
        <ContributerCount total={props.total} contributers={props.contributers} />
        {/* <Share /> */}
      </StoryModalContent>
      <StoryModalFooter>
        {/* <Button>Tips</Button> */}
        <BlueLinkBtn>Read More</BlueLinkBtn>
      </StoryModalFooter>
    </>
  );
};
