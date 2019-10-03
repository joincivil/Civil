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
import { Contributors, ContributorCount, ContributorData } from "../Contributors";
import { StoryNewsroomData, OpenGraphData } from "./types";

export interface StoryDetailsProps {
  activeChallenge: boolean;
  createdAt: string;
  newsroom: StoryNewsroomData;
  openGraphData: OpenGraphData;
  displayedContributors: ContributorData[];
  sortedContributors: ContributorData[];
  totalContributors: number;
  handleOpenNewsroom(): void;
}

export const StoryDetails: React.FunctionComponent<StoryDetailsProps> = props => {
  const { openGraphData } = props;

  return (
    <>
      <StoryModalFullBleedHeader>
        <StoryImgWide>
          <img src={openGraphData.images[0].url} />
        </StoryImgWide>
      </StoryModalFullBleedHeader>
      <StoryModalContent>
        <StoryTitle>{openGraphData.title}</StoryTitle>
        <StoryDetailsFlex>
          <StoryNewsroomStatus
            newsroom={props.newsroom}
            activeChallenge={props.activeChallenge}
            handleOpenNewsroom={props.handleOpenNewsroom}
          />
          <TimeStamp>{props.createdAt}</TimeStamp>
        </StoryDetailsFlex>
        <StoryDescription>{openGraphData.description}</StoryDescription>
        <Contributors label={"Recent Contributors"} sortedContributors={props.sortedContributors} />
        <ContributorCount
          totalContributors={props.totalContributors}
          displayedContributors={props.displayedContributors}
        />
        {/* <Share /> */}
      </StoryModalContent>
      <StoryModalFooter>
        {/* <Button>Tips</Button> */}
        <BlueLinkBtn href={openGraphData.url} target="_blank">
          Read More
        </BlueLinkBtn>
      </StoryModalFooter>
    </>
  );
};
