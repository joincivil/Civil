import * as React from "react";
import {
  StoryTitle,
  TimeStamp,
  TimeStampDot,
  StoryDetailsFlex,
  StoryDetailsFlexLeft,
  StoryDescription,
  StoryPostedAt,
  StoryImgWide,
  StoryDetailsFullBleedHeader,
  StoryDetailsContent,
  StoryDetailsFooter,
  StoryDetailsFooterFlex,
  BlueLinkBtn,
} from "./StoryFeedStyledComponents";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Contributors, ContributorCount, ContributorData } from "../Contributors";
import { StoryNewsroomData, OpenGraphData } from "./types";
import { PaymentButton, ShareButton } from "@joincivil/elements";
import { getTimeSince } from "@joincivil/utils";

export interface StoryDetailsProps {
  activeChallenge: boolean;
  createdAt: string;
  newsroom: StoryNewsroomData;
  openGraphData: OpenGraphData;
  displayedContributors: ContributorData[];
  sortedContributors: ContributorData[];
  totalContributors: number;
  handleShare(): void;
  handlePayments(): void;
  handleOpenNewsroom(): void;
}

export const StoryDetails: React.FunctionComponent<StoryDetailsProps> = props => {
  const { openGraphData } = props;
  const publishedTime = getTimeSince(openGraphData.article.published_time);

  return (
    <>
      {openGraphData.images && (
        <StoryDetailsFullBleedHeader>
          <StoryImgWide>
            <img src={openGraphData.images[0].url} />
          </StoryImgWide>
        </StoryDetailsFullBleedHeader>
      )}
      <StoryDetailsContent>
        <StoryDetailsFlex>
          <StoryTitle>{openGraphData.title}</StoryTitle>
          <ShareButton onClick={props.handleShare} textBottom={true}></ShareButton>
        </StoryDetailsFlex>
        <StoryDetailsFlexLeft>
          <StoryNewsroomStatus
            newsroom={props.newsroom}
            activeChallenge={props.activeChallenge}
            handleOpenNewsroom={props.handleOpenNewsroom}
          />
          <TimeStamp>
            <TimeStampDot>&#183;</TimeStampDot> {props.createdAt}
          </TimeStamp>
        </StoryDetailsFlexLeft>
        <StoryDescription>{openGraphData.description}</StoryDescription>
        <StoryPostedAt>{publishedTime && <TimeStamp>Posted on Civil {publishedTime}</TimeStamp>}</StoryPostedAt>
        <Contributors sortedContributors={props.sortedContributors} />
        {props.totalContributors !== 0 ? (
          <ContributorCount
            totalContributors={props.totalContributors}
            displayedContributors={props.displayedContributors}
          />
        ) : (
          <></>
        )}
      </StoryDetailsContent>
      <StoryDetailsFooter>
        <StoryDetailsFooterFlex>
          <PaymentButton onClick={props.handlePayments} border={true} />
          <BlueLinkBtn href={openGraphData.url} target="_blank">
            Read More
          </BlueLinkBtn>
        </StoryDetailsFooterFlex>
      </StoryDetailsFooter>
    </>
  );
};
