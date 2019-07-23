import * as React from "react";
import * as qs from "querystring";
import { Query, Mutation, MutationFunc } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

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

export interface DashboardNewsroomStripeConnectProps {
  newsroomAddress?: string;
}
export interface DashboardNewsroomStripeConnectState {
  connectStripeError?: any;
}

const CHANNEL_QUERY = gql`
  query Channel($contractAddress: String!) {
    channelsGetByNewsroomAddress(contractAddress: $contractAddress) {
      id
    }
  }
`;
// @TODO/tobek add `isStripeConnected` to query when that's deployed

export const CHANNEL_CONNECT_STRIPE_MUTATION = gql`
  mutation($input: ChannelsConnectStripeInput!) {
    channelsConnectStripe(input: $input)
  }
`;

export class DashboardNewsroomStripeConnect extends React.Component<
  DashboardNewsroomStripeConnectProps,
  DashboardNewsroomStripeConnectState
> {
  private qsParams: StripeOauthParams;

  constructor(props: DashboardNewsroomStripeConnectProps) {
    super(props);
    this.state = {};
    this.qsParams = qs.parse(document.location.search.substr(1));
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

          <Query query={CHANNEL_QUERY} variables={{ contractAddress: this.props.newsroomAddress }}>
            {({ loading, error, data }) => {
              if (loading) {
                return <StyledDashboardLoadingMessage>Connecting to Stripe</StyledDashboardLoadingMessage>;
              } else if (error || !data || !data.channelsGetByNewsroomAddress) {
                console.error(
                  "error loading channel data for",
                  this.props.newsroomAddress,
                  " error:",
                  error,
                  "data:",
                  data,
                );
                return (
                  <>
                    <ErrorIcon width={16} height={16} /> Sorry, there was an error loading your newsroom's Stripe
                    account details. Please try again later.
                  </>
                );
              }

              const channelData = data.channelsGetByNewsroomAddress;
              if (channelData.isStripeConnected) {
                return (
                  <>
                    <p>You are currently accepting credit cards through your connected Stripe account.</p>
                    <InvertedButton size={buttonSizes.SMALL} href="https://dashboard.stripe.com" target="_blank">
                      Go to Your Stripe Account <NorthEastArrow color={colors.accent.CIVIL_BLUE} />
                    </InvertedButton>
                  </>
                );
              } else if (this.state.connectStripeError) {
                console.error("error running channelsConnectStripe mutation:", this.state.connectStripeError);
                return (
                  <>
                    <ErrorIcon width={16} height={16} /> Sorry, there was an error connecting your newsroom to your
                    Stripe account. Please try again later.
                  </>
                );
              } else if (this.qsParams.code) {
                return (
                  <Mutation
                    mutation={CHANNEL_CONNECT_STRIPE_MUTATION}
                    refetchQueries={[
                      {
                        query: CHANNEL_QUERY,
                      },
                    ]}
                    variables={{ input: { channelID: channelData.id, oauthCode: this.qsParams.code } }}
                  >
                    {(connectStripe: MutationFunc) => {
                      // When this mutation has completed, because of the `refetchQueries` prop above, we should get `isStripeConnected` true and state will change away from this loading state automatically.
                      // @TODO/tobek This is being called dozens of times a second while it's erroring, check that this is no longer the case when the mutation has been deployed.
                      connectStripe().catch(err => this.setState({ connectStripeError: err }));
                      return (
                        <StyledDashboardLoadingMessage>Connecting your Stripe account</StyledDashboardLoadingMessage>
                      );
                    }}
                  </Mutation>
                );
              } else {
                return (
                  <>
                    <p>
                      Allows you to accept credit card payments for your Boosts. Stripe fees will apply. The Boost
                      amounts sent by supporters will go directly into your connected Stripe account. Civil will not
                      keep or hold any of your proceeds.
                    </p>
                    {this.qsParams.error && (
                      <p>
                        <ErrorIcon width={16} height={16} /> Error connecting your Stripe account: {this.qsParams.error}:{" "}
                        {this.qsParams.error_description}. Please try again.
                      </p>
                    )}
                    {/*@TODO/toby Our stripe client ID (which should be different on production) should be in some config, but we don't have any config for components package, would have to pass in from dapp via prop or add to civil context.*/}
                    <p>
                      <StripeConnectButtonLink href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_BzqgUsw7tnnCpVaoQ157mrxtuCdN7h2q&scope=read_write&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Fnewsrooms" />
                    </p>
                  </>
                );
              }
            }}
          </Query>
        </StripeContainer>
      </>
    );
  }
}
