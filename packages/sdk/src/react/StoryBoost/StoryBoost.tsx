import * as React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import {
  CivilContext,
  ICivilContext,
  LoadingMessage,
  ErrorNotFound,
  Contributors,
  ContributorCount,
  Payments,
  PaymentsModal,
  StoryNewsroomStatus,
} from "@joincivil/components";
import { StoryBoostData } from "./types";
import { storyBoostQuery } from "./queries";
import { fonts, colors, PaymentButton } from "@joincivil/elements";

const StoryBoostLoading = styled(LoadingMessage)`
  padding: 48px 0;
`;
const StoryBoostError = styled(ErrorNotFound)`
  padding: 32px 16px 16px;
  text-align: center;
`;

const StoryBoostHeader = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  padding: 15px 15px 12px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    margin: 0;
  }
`;

const StoryBoostStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  svg {
    vertical-align: bottom;
  }
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
  padding: 12px 15px;

  span {
    font-size: 16px;
    font-weight: 600;
  }
`;

const SupportText = styled.span`
  cursor: pointer;
  &:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

const StyledPaymentButton = styled(PaymentButton)`
  background: ${colors.accent.CIVIL_BLUE};
  width: 130px;
  padding: 6px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  &,
  &:hover {
    color: ${colors.basic.WHITE};
    svg path {
      fill: ${colors.basic.WHITE};
    }
  }
`;

export interface StoryBoostProps {
  boostId: string;
}

export interface StoryBoostState {
  paymentsOpen: boolean;
}

export class StoryBoost extends React.Component<StoryBoostProps, StoryBoostState> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

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
            return <StoryBoostLoading>Loading Story Boost</StoryBoostLoading>;
          } else if (error || !data || !data.postsGet) {
            console.error("error loading Story Feed data. error: ", error);
            return (
              <StoryBoostError>
                There was an error loading this Story Boost:
                <br />
                <code>{error ? error.toString() : "no data returned"}</code>
              </StoryBoostError>
            );
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
                <SupportText onClick={() => this.handleStartPayment("Support this newsroom")}>
                  Support this newsroom
                </SupportText>
                <StyledPaymentButton onClick={() => this.handleStartPayment("Boost")} />
              </StoryBoostFooter>
              <PaymentsModal open={this.state.paymentsOpen}>
                <Payments
                  postId={this.props.boostId}
                  newsroomName={storyBoostData.channel.newsroom.name}
                  paymentAddress={storyBoostData.channel.newsroom.multisigAddress}
                  isStripeConnected={storyBoostData.channel.isStripeConnected}
                  stripeAccountID={storyBoostData.channel.stripeAccountID}
                  handleClose={this.handleClose}
                />
              </PaymentsModal>
            </>
          );
        }}
      </Query>
    );
  }

  private handleStartPayment = (trackingLabel: string) => {
    this.context.fireAnalyticsEvent(
      "embedded story boost",
      "boost payment clicked: " + trackingLabel,
      this.props.boostId,
    );
    this.setState({ paymentsOpen: true });
  };
  private handleClose = () => {
    this.setState({ paymentsOpen: false });
  };
}
