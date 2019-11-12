import * as React from "react";
import { Contributors, ContributorCount, ContributorData, StoryNewsroomStatus } from "@joincivil/components";
import { PaymentButton, ShareButton } from "@joincivil/elements";
import { getTimeSince } from "@joincivil/utils";
import { OpenGraphData } from "./types";
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

export interface StoryDetailsProps {
  activeChallenge: boolean;
  createdAt: string;
  newsroomName: string;
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
            newsroomName={props.newsroomName}
            activeChallenge={props.activeChallenge}
            handleOpenNewsroom={props.handleOpenNewsroom}
          />
          {openGraphData.article && openGraphData.article.published_time && (
            <TimeStamp>
              <TimeStampDot>&#183;</TimeStampDot> {getTimeSince(openGraphData.article.published_time)}
            </TimeStamp>
          )}
        </StoryDetailsFlexLeft>
        {openGraphData.description && <StoryDescription>{openGraphData.description}</StoryDescription>}
        <StoryPostedAt>
          <TimeStamp>Posted on Civil {getTimeSince(props.createdAt)}</TimeStamp>
        </StoryPostedAt>
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
