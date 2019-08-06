import * as React from "react";
import * as qs from "querystring";
import { withApollo, WithApolloClient } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import { CivilContext, ICivilContext } from "../context/CivilContext";
import {
  withNewsroomChannel,
  WithNewsroomChannelInjectedProps,
  CHANNEL_BY_NEWSROOM_QUERY,
} from "../WithNewsroomChannelHOC";
import { StyledDashboardNewsroomHdr, StyledDashboardLoadingMessage } from "./DashboardStyledComponents";
import { ErrorIcon, NorthEastArrow } from "../icons";
import { colors } from "../styleConstants";
import { InvertedButton, buttonSizes } from "../Button";

import * as stripeLogo from "../images/stripe-logo-blue.png";
import * as stripeConnectButtonLight from "../images/stripe-connect-blue-on-light.png";
import * as stripeConnectButtonDark from "../images/stripe-connect-blue-on-dark.png";

export const StripeContainer = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 20px 16px 24px;
`;
const StripeLogo = styled.img`
  display: block;
  height: 24px;
  margin-bottom: 10px;
  width: auto;
`;
const StripeConnectButtonLink = styled.a`
  background-size: contain;
  display: inline-block;
  height: 33px;
  width: 190px;

  background-image: url("${stripeConnectButtonLight}");
  &:hover {
    background-image: url("${stripeConnectButtonDark}");
  }
  // Preload image to prevent flash on hover:
  &:after {
    content: url("${stripeConnectButtonDark}");
    position: absolute;
    left: -50000px;
  }
`;

export interface StripeOauthParams {
  code?: string;
  error?: string;
  error_description?: string;
}

export interface DashboardNewsroomStripeConnectOwnProps {
  newsroomAddress: string;
}
export interface DashboardNewsroomStripeConnectState {
  connectingStripe?: boolean;
  connectStripeError?: any;
}
export type DashboardNewsroomStripeConnectProps = WithApolloClient<
  DashboardNewsroomStripeConnectOwnProps & WithNewsroomChannelInjectedProps
>;

export const CHANNEL_CONNECT_STRIPE_MUTATION = gql`
  mutation($input: ChannelsConnectStripeInput!) {
    channelsConnectStripe(input: $input) {
      id
    }
  }
`;

export class DashboardNewsroomStripeConnectComponent extends React.Component<
  DashboardNewsroomStripeConnectProps,
  DashboardNewsroomStripeConnectState
> {
  public static contextType: React.Context<ICivilContext> = CivilContext;
  public context!: React.ContextType<typeof CivilContext>;
  private qsParams: StripeOauthParams;

  constructor(props: DashboardNewsroomStripeConnectProps) {
    super(props);
    this.state = {};
    this.qsParams = qs.parse(document.location.search.substr(1));
  }

  public async componentDidMount(): Promise<void> {
    if (this.qsParams.code) {
      try {
        this.setState({ connectingStripe: true });
        await this.props.client.mutate({
          mutation: CHANNEL_CONNECT_STRIPE_MUTATION,
          variables: { input: { channelID: this.props.channelData.id, oauthCode: this.qsParams.code } },
          refetchQueries: [
            {
              query: CHANNEL_BY_NEWSROOM_QUERY,
              variables: {
                contractAddress: this.props.newsroomAddress,
              },
            },
          ],
        });
        this.setState({ connectingStripe: false });
      } catch (err) {
        console.error("error running channelsConnectStripe mutation:", err);
        this.setState({ connectStripeError: err });
      }
    }
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledDashboardNewsroomHdr>Credit Card Payments Setup</StyledDashboardNewsroomHdr>
        <p>
          Connect a Stripe account to accept credit card payments for your Boosts. You can link your existing Stripe
          account or start a new one.{" "}
          <a href="#@TODO/tobek" target="_blank">
            Learn more
          </a>
        </p>

        <StripeContainer>
          <StripeLogo src={stripeLogo} />
          {this.renderBody()}
        </StripeContainer>
      </>
    );
  }

  private renderBody(): JSX.Element {
    if (!this.props.channelData.currentUserIsAdmin) {
      return (
        <>
          {/*@TODO/tobek When we have a flow for updating newsroom channel admins, add it here*/}
          <ErrorIcon width={16} height={16} /> You are not an admin for this Newsroom, so you cannot edit its Stripe
          settings. Please contact an admin to be added.
        </>
      );
    } else if (!this.state.connectingStripe && this.props.channelData.isStripeConnected) {
      const justConnected = this.qsParams.code;
      return (
        <>
          <p>
            {justConnected ? "Connection successful! You are now" : "You are currently"} accepting credit cards through
            your connected Stripe account.
          </p>
          <p>
            <InvertedButton size={buttonSizes.SMALL} href="https://dashboard.stripe.com" target="_blank">
              Go to Your Stripe Dashboard
              <NorthEastArrow color={colors.accent.CIVIL_BLUE} />
            </InvertedButton>
          </p>
          {!justConnected && this.renderStripeConnectButton("Connect a different Stripe account")}
        </>
      );
    } else if (this.state.connectStripeError) {
      return (
        <>
          <p>
            <ErrorIcon width={16} height={16} /> Sorry, there was an error connecting your Newsroom to your Stripe
            account:{" "}
            <code>{JSON.stringify(this.state.connectStripeError.message || this.state.connectStripeError)}</code>.
            Please try again.
          </p>
          {this.renderStripeConnectButton()}
        </>
      );
    } else if (this.state.connectingStripe || this.qsParams.code) {
      return <StyledDashboardLoadingMessage>Connecting your Stripe account</StyledDashboardLoadingMessage>;
    } else if (this.qsParams.error) {
      return (
        <>
          <p>
            <ErrorIcon width={16} height={16} /> Error connecting your Stripe account: {this.qsParams.error}:{" "}
            {this.qsParams.error_description}. Please try again.
          </p>
          {this.renderStripeConnectButton()}
        </>
      );
    } else {
      return (
        <>
          <p>
            Allows you to accept credit card payments for your Boosts. Stripe fees will apply. The Boost amounts sent by
            supporters will go directly into your connected Stripe account. Civil will not keep or hold any of your
            proceeds.
          </p>
          {this.renderStripeConnectButton()}
        </>
      );
    }
  }

  private renderStripeConnectButton(linkText?: string): JSX.Element {
    // @TODO/toby Remove `stripe-admin` feature flag query string param when launched
    const redirectUrl = `${document.location.origin}/dashboard/newsrooms?feature-flag=stripe-admin`;
    const oauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${
      this.context.config.STRIPE_CLIENT_ID
    }&scope=read_write&redirect_uri=${encodeURIComponent(redirectUrl)}`;
    return <p>{linkText ? <a href={oauthUrl}>{linkText}</a> : <StripeConnectButtonLink href={oauthUrl} />}</p>;
  }
}

export const DashboardNewsroomStripeConnect = withApollo(withNewsroomChannel(DashboardNewsroomStripeConnectComponent));
