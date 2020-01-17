import * as React from "react";
import styled, { ThemeProvider } from "styled-components/macro";
import { Query } from "react-apollo";
import {
  LoadingMessage,
  Payments,
  PaymentsModal,
  CivilContext,
  ICivilContext,
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
  fireTrackingEvent(category: string, event: string, label: string): void;
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
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  civilContext.renderContext = RENDER_CONTEXT.DAPP;
  const theme = {
    ...DEFAULT_CHECKBOX_THEME,
    ...DEFAULT_BUTTON_THEME,
    renderContext: RENDER_CONTEXT.DAPP,
  };

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
        return (
          <>
            <StoryModal open={isStoryModalOpen} handleClose={props.closeStoryBoost}>
              <StoryDetails
                postId={props.postId}
                activeChallenge={false}
                createdAt={storyBoostData.createdAt}
                newsroomName={storyBoostData.channel.newsroom.name}
                title={storyBoostData.openGraphData.title}
                url={storyBoostData.openGraphData.url}
                openGraphData={storyBoostData.openGraphData}
                displayedContributors={storyBoostData.groupedSanitizedPayments}
                sortedContributors={storyBoostData.groupedSanitizedPayments}
                totalContributors={
                  storyBoostData.groupedSanitizedPayments ? storyBoostData.groupedSanitizedPayments.length : 0
                }
                fireTrackingEvent={props.fireTrackingEvent}
                handlePayments={props.openPayments}
                handleOpenNewsroom={props.openStoryNewsroomDetails}
              />
            </StoryModal>
            <StoryModal open={isStoryNewsroomModalOpen} handleClose={props.closeStoryBoost}>
              <StoryNewsroomDetails
                activeChallenge={false}
                newsroom={{ ...storyBoostData.channel.newsroom, handle: storyBoostData.channel.handle }}
              />
            </StoryModal>
            <ThemeProvider theme={theme}>
              <PaymentsModal open={isPaymentsModalOpen} handleClose={props.closeStoryBoost}>
                <Payments
                  postId={props.postId}
                  newsroomName={storyBoostData.channel.newsroom.name}
                  paymentAddress={storyBoostData.channel.newsroom.multisigAddress}
                  isStripeConnected={storyBoostData.channel.isStripeConnected}
                  stripeAccountID={storyBoostData.channel.stripeAccountID}
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
