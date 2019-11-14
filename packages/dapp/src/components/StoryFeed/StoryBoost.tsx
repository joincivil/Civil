import * as React from "react";
import styled, { ThemeProvider } from "styled-components/macro";
import { Query } from "react-apollo";
import {
  LoadingMessage,
  Payments,
  PaymentsModal,
  RENDER_CONTEXT,
  DEFAULT_BUTTON_THEME,
  DEFAULT_CHECKBOX_THEME,
} from "@joincivil/components";
import { StoryDetails } from "./StoryDetails";
import { StoryNewsroomDetails } from "./StoryNewsroomDetails";
import { StoryModal } from "./StoryModal";
import { ShareStory, SharePanel } from "@joincivil/elements";
import { StoryBoostData } from "./types";
import { STORY_BOOST } from "./queries";

export interface StoryBoostProps {
  postId: string;
  payment?: boolean;
  newsroom?: boolean;
  openStoryNewsroomDetails(): void;
  openStoryDetails(): void;
  openPayments(): void;
  closeStoryBoost(): void;
  handlePaymentSuccess(): void;
}

export interface StoryBoostState {
  isStoryModalOpen: boolean;
  isStoryNewsroomModalOpen: boolean;
  isPaymentsModalOpen: boolean;
  isShareModalOpen: boolean;
}

export class StoryBoost extends React.Component<StoryBoostProps, StoryBoostState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isStoryModalOpen: this.props.payment || this.props.newsroom ? false : true,
      isStoryNewsroomModalOpen: this.props.newsroom || false,
      isPaymentsModalOpen: this.props.payment || false,
      isShareModalOpen: false,
    };
  }

  public render(): JSX.Element {
    const id = this.props.postId;

    return (
      <Query query={STORY_BOOST} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingMessage>Loading Boost</LoadingMessage>;
          } else if (error || !data || !data.postsGet) {
            console.error("error loading Story Boost data. error:", error, "data:", data);
            return "Error loading Story Boost.";
          }

          const storyBoostData = data.postsGet as StoryBoostData;
          const theme = {
            ...DEFAULT_CHECKBOX_THEME,
            ...DEFAULT_BUTTON_THEME,
            renderContext: RENDER_CONTEXT.DAPP,
          };

          return (
            <>
              <StoryModal open={this.state.isStoryModalOpen} handleClose={this.props.closeStoryBoost}>
                <StoryDetails
                  activeChallenge={false}
                  createdAt={storyBoostData.createdAt}
                  newsroomName={storyBoostData.channel.newsroom.charter.name}
                  openGraphData={storyBoostData.openGraphData}
                  displayedContributors={storyBoostData.groupedSanitizedPayments}
                  sortedContributors={storyBoostData.groupedSanitizedPayments}
                  totalContributors={
                    storyBoostData.groupedSanitizedPayments ? storyBoostData.groupedSanitizedPayments.length : 0
                  }
                  handleShare={this.openShare}
                  handlePayments={this.props.openPayments}
                  handleOpenNewsroom={this.props.openStoryNewsroomDetails}
                />
              </StoryModal>
              <StoryModal open={this.state.isStoryNewsroomModalOpen} handleClose={this.props.closeStoryBoost}>
                <StoryNewsroomDetails activeChallenge={false} newsroom={storyBoostData.channel.newsroom} />
              </StoryModal>
              <PaymentsModal open={this.state.isPaymentsModalOpen} handleClose={this.props.closeStoryBoost}>
                <ThemeProvider theme={theme}>
                  <Payments
                    postId={this.props.postId}
                    newsroomName={storyBoostData.channel.newsroom.charter.name}
                    paymentAddress={storyBoostData.channel.newsroom.multisigAddress}
                    isStripeConnected={storyBoostData.channel.isStripeConnected}
                    handleClose={this.props.handlePaymentSuccess}
                  />
                </ThemeProvider>
              </PaymentsModal>
              <SharePanel open={this.state.isShareModalOpen} handleClose={this.handleCloseShare}>
                <ShareStory title={storyBoostData.openGraphData.title} url={storyBoostData.openGraphData.url} />
              </SharePanel>
            </>
          );
        }}
      </Query>
    );
  }

  private openShare = () => {
    this.setState({ isShareModalOpen: true });
  };

  private handleCloseShare = () => {
    this.setState({ isShareModalOpen: false });
  };
}
