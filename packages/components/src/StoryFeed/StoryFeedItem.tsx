import * as React from "react";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Story } from "./Story";
import { StoryDetails } from "./StoryDetails";
import { StoryNewsroomDetails } from "./StoryNewsroomDetails";
import { StoryModal } from "./StoryModal";
import { ContributorCount, ContributorData } from "../Contributors";
import { StoryFeedItemWrap, StoryElementsFlex } from "./StoryFeedStyledComponents";
import { StoryNewsroomData, OpenGraphData } from "./types";
import { Payments } from "../Payments";
import { PaymentButton, ShareButton, ShareStory, Panel } from "@joincivil/elements";
import { getTimeSince } from "@joincivil/utils";

export interface StoryFeedItemProps {
  storyId: string;
  activeChallenge: boolean;
  createdAt: string;
  isStripeConnected: boolean;
  newsroom: StoryNewsroomData;
  openGraphData: OpenGraphData;
  displayedContributors: ContributorData[];
  sortedContributors: ContributorData[];
  totalContributors: number;
}

export interface StoryFeedItemStates {
  isStoryModalOpen: boolean;
  isStoryNewsroomModalOpen: boolean;
  isPaymentsModalOpen: boolean;
  isShareModalOpen: boolean;
}

export class StoryFeedItem extends React.Component<StoryFeedItemProps, StoryFeedItemStates> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isStoryModalOpen: false,
      isStoryNewsroomModalOpen: false,
      isPaymentsModalOpen: false,
      isShareModalOpen: false,
    };
  }

  public render(): JSX.Element {
    const {
      activeChallenge,
      createdAt,
      newsroom,
      openGraphData,
      displayedContributors,
      sortedContributors,
      totalContributors,
    } = this.props;

    const timeSinceArticleCreated = getTimeSince(createdAt);

    return (
      <>
        <StoryFeedItemWrap>
          <StoryNewsroomStatus
            newsroom={newsroom}
            activeChallenge={activeChallenge}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
          <Story
            createdAt={timeSinceArticleCreated}
            openGraphData={openGraphData}
            handleOpenStory={this.openStoryDetails}
          />
          <StoryElementsFlex>
            <ContributorCount totalContributors={totalContributors} displayedContributors={displayedContributors} />
            <StoryElementsFlex>
              <PaymentButton onClick={this.openPayments} />
              <ShareButton onClick={this.openShare} />
            </StoryElementsFlex>
          </StoryElementsFlex>
        </StoryFeedItemWrap>
        <StoryModal open={this.state.isStoryModalOpen} handleClose={this.handleClose}>
          <StoryDetails
            activeChallenge={activeChallenge}
            createdAt={timeSinceArticleCreated}
            newsroom={newsroom}
            openGraphData={openGraphData}
            displayedContributors={displayedContributors}
            sortedContributors={sortedContributors}
            totalContributors={totalContributors}
            handleShare={this.openShare}
            handlePayments={this.openPayments}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
        </StoryModal>
        <StoryModal open={this.state.isStoryNewsroomModalOpen} handleClose={this.handleClose}>
          <StoryNewsroomDetails activeChallenge={activeChallenge} newsroom={newsroom} />
        </StoryModal>
        <Panel open={this.state.isPaymentsModalOpen} handleClose={this.handleClose}>
          <Payments
            postId={this.props.storyId}
            newsroomName={this.props.newsroom.charter.name}
            paymentAddress={this.props.newsroom.multisigAddress}
            isStripeConnected={this.props.isStripeConnected}
          />
        </Panel>
        <StoryModal open={this.state.isShareModalOpen} handleClose={this.handleClose}>
          <ShareStory title={openGraphData.title} url={openGraphData.url} />
        </StoryModal>
      </>
    );
  }

  private openPayments = () => {
    this.setState({
      isPaymentsModalOpen: true,
      isStoryModalOpen: false,
      isStoryNewsroomModalOpen: false,
      isShareModalOpen: false,
    });
  };

  private openShare = () => {
    this.setState({
      isShareModalOpen: true,
      isPaymentsModalOpen: false,
      isStoryModalOpen: false,
      isStoryNewsroomModalOpen: false,
    });
  };

  private openStoryDetails = () => {
    this.setState({
      isStoryModalOpen: true,
      isStoryNewsroomModalOpen: false,
      isPaymentsModalOpen: false,
      isShareModalOpen: false,
    });
  };

  private openStoryNewsroomDetails = () => {
    this.setState({
      isStoryNewsroomModalOpen: true,
      isStoryModalOpen: false,
      isPaymentsModalOpen: false,
      isShareModalOpen: false,
    });
  };

  private handleClose = () => {
    this.setState({
      isStoryModalOpen: false,
      isStoryNewsroomModalOpen: false,
      isPaymentsModalOpen: false,
      isShareModalOpen: false,
    });
  };
}
