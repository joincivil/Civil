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
import { PaymentButton, ShareButton, ShareStory, Panel, SharePanel } from "@joincivil/elements";
import { EthAddress } from "@joincivil/core";

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
  isLoggedIn: boolean;
  userAddress?: EthAddress;
  userEmail?: string;
  handleLogin(): void;
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

    return (
      <>
        <StoryFeedItemWrap>
          <StoryNewsroomStatus
            newsroomName={newsroom.charter.name}
            activeChallenge={activeChallenge}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
          <Story openGraphData={openGraphData} handleOpenStory={this.openStoryDetails} />
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
            createdAt={createdAt}
            newsroomName={newsroom.charter.name}
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
        <Panel open={this.state.isPaymentsModalOpen} handleClose={this.handleClosePayments}>
          <Payments
            isLoggedIn={this.props.isLoggedIn}
            userAddress={this.props.userAddress}
            userEmail={this.props.userEmail}
            postId={this.props.storyId}
            newsroomName={this.props.newsroom.charter.name}
            paymentAddress={this.props.newsroom.multisigAddress}
            isStripeConnected={this.props.isStripeConnected}
            handleLogin={this.props.handleLogin}
            handleClose={this.handleClosePayments}
          />
        </Panel>
        <SharePanel open={this.state.isShareModalOpen} handleClose={this.handleCloseShare}>
          <ShareStory title={openGraphData.title} url={openGraphData.url} />
        </SharePanel>
      </>
    );
  }

  private openStoryDetails = () => {
    this.setState({ isStoryModalOpen: true, isStoryNewsroomModalOpen: false });
  };

  private openStoryNewsroomDetails = () => {
    this.setState({ isStoryNewsroomModalOpen: true, isStoryModalOpen: false });
  };

  private handleClose = () => {
    this.setState({ isStoryModalOpen: false, isStoryNewsroomModalOpen: false });
  };

  private openPayments = () => {
    this.setState({ isPaymentsModalOpen: true });
  };

  private handleClosePayments = () => {
    this.setState({ isPaymentsModalOpen: false });
  };

  private openShare = () => {
    this.setState({ isShareModalOpen: true });
  };

  private handleCloseShare = () => {
    this.setState({ isShareModalOpen: false });
  };
}
