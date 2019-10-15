import * as React from "react";
import { StoryNewsroomStatus } from "./StoryNewsroomStatus";
import { Story } from "./Story";
import { StoryDetails } from "./StoryDetails";
import { StoryNewsroomDetails } from "./StoryNewsroomDetails";
import { StoryModal } from "./StoryModal";
import { ContributorCount, ContributorData } from "../Contributors";
import { StoryFeedItemWrap, StoryElements } from "./StoryFeedStyledComponents";
import { StoryNewsroomData, OpenGraphData } from "./types";
import { Payments } from "../Payments";
import { PaymentButton } from "@joincivil/elements";

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
}

export class StoryFeedItem extends React.Component<StoryFeedItemProps, StoryFeedItemStates> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isStoryModalOpen: false,
      isStoryNewsroomModalOpen: false,
      isPaymentsModalOpen: false,
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
            newsroom={newsroom}
            activeChallenge={activeChallenge}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
          <Story createdAt={createdAt} openGraphData={openGraphData} handleOpenStory={this.openStoryDetails} />
          <StoryElements>
            <ContributorCount totalContributors={totalContributors} displayedContributors={displayedContributors} />
            <PaymentButton onClick={this.openPayments} />
          </StoryElements>
        </StoryFeedItemWrap>
        <StoryModal open={this.state.isStoryModalOpen} handleClose={this.handleClose}>
          <StoryDetails
            activeChallenge={activeChallenge}
            createdAt={createdAt}
            newsroom={newsroom}
            openGraphData={openGraphData}
            displayedContributors={displayedContributors}
            sortedContributors={sortedContributors}
            totalContributors={totalContributors}
            handleOpenNewsroom={this.openStoryNewsroomDetails}
          />
        </StoryModal>
        <StoryModal open={this.state.isStoryNewsroomModalOpen} handleClose={this.handleClose}>
          <StoryNewsroomDetails activeChallenge={activeChallenge} newsroom={newsroom} />
        </StoryModal>
        <StoryModal open={this.state.isPaymentsModalOpen} handleClose={this.handleClose}>
          <Payments
            postId={this.props.storyId}
            newsroomName={this.props.newsroom.charter.name}
            paymentAddress={this.props.newsroom.multisigAddress}
            isStripeConnected={this.props.isStripeConnected}
          />
        </StoryModal>
      </>
    );
  }

  private openPayments = () => {
    this.setState({ isPaymentsModalOpen: true, isStoryModalOpen: false, isStoryNewsroomModalOpen: false });
  };

  private openStoryDetails = () => {
    this.setState({ isStoryModalOpen: true, isStoryNewsroomModalOpen: false, isPaymentsModalOpen: false });
  };

  private openStoryNewsroomDetails = () => {
    this.setState({ isStoryNewsroomModalOpen: true, isStoryModalOpen: false, isPaymentsModalOpen: false });
  };

  private handleClose = () => {
    this.setState({ isStoryModalOpen: false, isStoryNewsroomModalOpen: false, isPaymentsModalOpen: false });
  };
}
