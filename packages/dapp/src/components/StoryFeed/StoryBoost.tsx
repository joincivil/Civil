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

export const StoryBoost: React.FunctionComponent<StoryBoostProps> = props => {
  const id = props.postId;
  const isStoryModalOpen = props.payment || props.newsroom ? false : true;
  const isStoryNewsroomModalOpen = props.newsroom || false;
  const isPaymentsModalOpen = props.payment || false;

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
            <StoryModal open={isStoryModalOpen} handleClose={props.closeStoryBoost}>
              <StoryDetails
                activeChallenge={false}
                createdAt={storyBoostData.createdAt}
                newsroomName={storyBoostData.channel.newsroom.charter.name}
                title={storyBoostData.openGraphData.title}
                url={storyBoostData.openGraphData.url}
                openGraphData={storyBoostData.openGraphData}
                displayedContributors={storyBoostData.groupedSanitizedPayments}
                sortedContributors={storyBoostData.groupedSanitizedPayments}
                totalContributors={
                  storyBoostData.groupedSanitizedPayments ? storyBoostData.groupedSanitizedPayments.length : 0
                }
                handlePayments={props.openPayments}
                handleOpenNewsroom={props.openStoryNewsroomDetails}
              />
            </StoryModal>
            <StoryModal open={isStoryNewsroomModalOpen} handleClose={props.closeStoryBoost}>
              <StoryNewsroomDetails activeChallenge={false} newsroom={storyBoostData.channel.newsroom} />
            </StoryModal>
            <ThemeProvider theme={theme}>
              <PaymentsModal open={isPaymentsModalOpen} handleClose={props.closeStoryBoost}>
                <Payments
                  postId={props.postId}
                  newsroomName={storyBoostData.channel.newsroom.charter.name}
                  paymentAddress={storyBoostData.channel.newsroom.multisigAddress}
                  isStripeConnected={storyBoostData.channel.isStripeConnected}
                  handleClose={props.handlePaymentSuccess}
                />
              </PaymentsModal>
            </ThemeProvider>
          </>
        );
      }}
    </Query>
  );
};