import * as React from "react";
import {
  Contributors,
  ContributorCount,
  ContributorData,
  StoryNewsroomStatus,
  storyPlaceholderImgUrl,
} from "@joincivil/components";
import { PaymentButton, ShareButton, ShareStory, SharePanel, Chevron } from "@joincivil/elements";
import { getTimeSince } from "@joincivil/utils";
import { OpenGraphData } from "./types";
import {
  StoryLink,
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
  title: string;
  url: string;
  openGraphData: OpenGraphData;
  displayedContributors: ContributorData[];
  sortedContributors: ContributorData[];
  totalContributors: number;
  handlePayments(): void;
  handleOpenNewsroom(): void;
}

export const StoryDetails: React.FunctionComponent<StoryDetailsProps> = props => {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const { openGraphData } = props;

  return (
    <>
      <StoryDetailsFullBleedHeader>
        <StoryImgWide>
          {openGraphData.images ? <img src={openGraphData.images[0].url} /> : <img src={storyPlaceholderImgUrl} />}
        </StoryImgWide>
      </StoryDetailsFullBleedHeader>
      <StoryDetailsContent>
        <StoryDetailsFlex>
          <StoryLink href={openGraphData.url} target="_blank">
            <StoryTitle>
              {openGraphData.title}
              <Chevron height={16} width={16} />
            </StoryTitle>
          </StoryLink>
          <ShareButton onClick={() => setShareModalOpen(true)} textBottom={true}></ShareButton>
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
      <SharePanel open={shareModalOpen} handleClose={() => setShareModalOpen(false)}>
        <ShareStory title={props.title} url={props.url} />
      </SharePanel>
    </>
  );
};
