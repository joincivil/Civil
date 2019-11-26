import * as React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import {
  LoadingMessage,
  Contributors,
  ContributorCount,
  Payments,
  PaymentsModal,
  StoryNewsroomStatus,
} from "@joincivil/components";
import { StoryBoostData } from "./types";
import { storyBoostQuery } from "./queries";
import { fonts, colors, PaymentButton } from "@joincivil/elements";

const StoryBoostHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  padding: 15px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    margin: 0;
  }
`;

const StoryBoostStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const StoryBoostContent = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 15px;
`;

const StoryBoostFooter = styled.div`
  align-items: center;
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  justify-content: space-between;
  padding: 15px;

  span {
    font-size: 16px;
    font-weight: 600;
  }
`;

export interface StoryBoostProps {
  boostId: string;
}

export interface StoryBoostState {
  paymentsOpen: boolean;
}

export class StoryBoost extends React.Component<StoryBoostProps, StoryBoostState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      paymentsOpen: false,
    };
  }

  public render(): JSX.Element {
    const id = this.props.boostId;

    return (
      <Query query={storyBoostQuery} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) {
            return <LoadingMessage>Loading Story Boost</LoadingMessage>;
          } else if (error || !data || !data.postsGet) {
            console.error("error loading Story Feed data. error: ", error);
            return "Error loading Story Boost.";
          }

          const storyBoostData = data.postsGet as StoryBoostData;

          return (
            <>
              <StoryBoostHeader>
                <StoryBoostStatus>
                  <StoryNewsroomStatus newsroomName={storyBoostData.channel.newsroom.name} activeChallenge={false} />
                </StoryBoostStatus>
                <h2>{storyBoostData.openGraphData.title}</h2>
              </StoryBoostHeader>
              <StoryBoostContent>
                <Contributors sortedContributors={storyBoostData.groupedSanitizedPayments} />
                {storyBoostData.groupedSanitizedPayments && storyBoostData.groupedSanitizedPayments.length !== 0 ? (
                  <ContributorCount
                    totalContributors={storyBoostData.groupedSanitizedPayments.length}
                    displayedContributors={storyBoostData.groupedSanitizedPayments}
                  />
                ) : (
                  <></>
                )}
              </StoryBoostContent>
              <StoryBoostFooter>
                <span>Support this newsroom</span>
                <PaymentButton onClick={this.handleStartPayment} />
              </StoryBoostFooter>
              <PaymentsModal open={this.state.paymentsOpen}>
                <Payments
                  postId={this.props.boostId}
                  newsroomName={storyBoostData.channel.newsroom.name}
                  paymentAddress={storyBoostData.channel.newsroom.multisigAddress}
                  isStripeConnected={storyBoostData.channel.isStripeConnected}
                  handleClose={this.handleClose}
                />
              </PaymentsModal>
            </>
          );
        }}
      </Query>
    );
  }

  private handleStartPayment = () => {
    this.setState({ paymentsOpen: true });
  };
  private handleClose = () => {
    this.setState({ paymentsOpen: false });
  };
}
