import * as React from "react";
import { Link } from "react-router-dom";
import { urlConstants, copyToClipboard } from "@joincivil/utils";
import { EthAddressViewer } from "../EthAddressViewer";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { ChevronAnchor } from "../ChevronAnchor";
import { InvertedButton, buttonSizes } from "../Button";
import { FeatureFlag } from "../features";
import {
  StyledDashboardNewsroom,
  StyledDashboardNewsroomName,
  StyledDashboardNewsroomSection,
  StyledDashboardNewsroomSectionContentRow,
  StyledDashboardNewsroomHdr,
  StyledDashboardNewsroomSubHdr,
  StyledDashboardNewsroomTerHdr,
  StyledDashboardNewsroomBorder,
  StyledChallengeIDKicker,
  StyledDashboardNewsroomLinks,
  StyledDashboardNewsroomTokensContainer,
  StyledDashboardNewsroomTokensLabel,
  StyledCVLLabel,
  StyledEmbedCode,
} from "./DashboardStyledComponents";
import { DashboardNewsroomStripeConnect } from "./DashboardNewsroomStripeConnect";
import { DashboardNewsroomSubmitLink } from "./DashboardNewsroomSubmitLink";
import { NewsroomProceeds } from "./DashboardNewsroomProceeds";

export interface DashboardNewsroomProps {
  newsroomName: string;
  newsroomAddress: string;
  listingDetailURL: string;
  manageNewsroomURL: string;
  newsroomDeposit: string;
  etherscanBaseURL: string;
  newsroomMultiSigBalance: string;
  newsroomMultiSigAddress?: string;
  isAccepted?: boolean;
  isInProgress?: boolean;
  isUnderChallenge?: boolean;
  isRejected?: boolean;
  acceptedDate?: string;
  inProgressPhaseDisplayName?: string;
  inProgressPhaseCountdown?: JSX.Element;
  inProgressPhaseDetails?: string | JSX.Element;
  boostProceeds?: JSX.Element;
  rejectedDate?: string;
}

const CHANNEL_ID_FROM_NEWSROOM_ADDRESS_QUERY = gql`
  query($contractAddress: String!) {
    channelsGetByNewsroomAddress(contractAddress: $contractAddress) {
      id
    }
  }
`;

const DashboardNewsroomRegistryStatusBase: React.FunctionComponent<DashboardNewsroomProps> = props => {
  let statusDisplay;
  let statusDetails: string | JSX.Element = <></>;

  const {
    isAccepted,
    isInProgress,
    isRejected,
    acceptedDate,
    inProgressPhaseDisplayName,
    inProgressPhaseCountdown,
    inProgressPhaseDetails,
    rejectedDate,
  } = props;

  if (isInProgress) {
    statusDisplay = inProgressPhaseDisplayName;
    if (inProgressPhaseCountdown) {
      statusDetails = inProgressPhaseCountdown;
    } else if (inProgressPhaseDetails) {
      statusDetails = inProgressPhaseDetails;
    }
  } else if (isAccepted) {
    statusDisplay = "Accepted";
    if (acceptedDate) {
      statusDisplay = "Accepted Date";
      statusDetails = <>{acceptedDate}</>;
    }
  } else if (isRejected) {
    statusDisplay = "Rejected";
    if (rejectedDate) {
      statusDisplay = "Rejected Date";
      statusDetails = <>{rejectedDate}</>;
    }
  }
  return (
    <>
      <StyledChallengeIDKicker>{statusDisplay}</StyledChallengeIDKicker>
      {statusDetails}
    </>
  );
};

const DashboardNewsroomRegistryStatus = React.memo(DashboardNewsroomRegistryStatusBase);

const DashboardNewsroomBase: React.FunctionComponent<DashboardNewsroomProps> = props => {
  const [copied, setCopied] = React.useState(false);
  const storyBoostEmbed = '<script src="http://registry.civil.co/loader/boost.js"></script>';

  return (
    <StyledDashboardNewsroom>
      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomSectionContentRow>
          <StyledDashboardNewsroomName>{props.newsroomName}</StyledDashboardNewsroomName>

          <StyledDashboardNewsroomLinks>
            <ChevronAnchor component={Link} to={props.manageNewsroomURL}>
              Manage Newsroom
            </ChevronAnchor>
            <ChevronAnchor component={Link} to={props.listingDetailURL}>
              View on Registry
            </ChevronAnchor>
          </StyledDashboardNewsroomLinks>
        </StyledDashboardNewsroomSectionContentRow>
      </StyledDashboardNewsroomSection>

      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomSectionContentRow>
          <StyledDashboardNewsroomHdr>Newsroom Token Balance</StyledDashboardNewsroomHdr>
          <StyledDashboardNewsroomTokensContainer>
            {props.newsroomMultiSigBalance} <StyledCVLLabel>CVL</StyledCVLLabel>
            <StyledDashboardNewsroomTokensLabel>Tokens in Newsroom Wallet</StyledDashboardNewsroomTokensLabel>
          </StyledDashboardNewsroomTokensContainer>
        </StyledDashboardNewsroomSectionContentRow>
      </StyledDashboardNewsroomSection>

      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomHdr>Status on the Registry</StyledDashboardNewsroomHdr>

        <StyledDashboardNewsroomSectionContentRow>
          <div>
            <DashboardNewsroomRegistryStatus {...props} />
          </div>
          <StyledDashboardNewsroomTokensContainer>
            {props.newsroomDeposit} <StyledCVLLabel>CVL</StyledCVLLabel>
            <StyledDashboardNewsroomTokensLabel>Newsroom Token Deposit</StyledDashboardNewsroomTokensLabel>
          </StyledDashboardNewsroomTokensContainer>
        </StyledDashboardNewsroomSectionContentRow>
      </StyledDashboardNewsroomSection>

      <StyledDashboardNewsroomSection>
        {props.newsroomMultiSigAddress && (
          <EthAddressViewer
            address={props.newsroomMultiSigAddress}
            displayName="Newsroom Public Wallet Address"
            etherscanBaseURL={props.etherscanBaseURL}
          />
        )}

        <EthAddressViewer
          address={props.newsroomAddress}
          displayName="Newsroom Smart Contract Address"
          etherscanBaseURL={props.etherscanBaseURL}
        />
      </StyledDashboardNewsroomSection>

      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomHdr>Boosts</StyledDashboardNewsroomHdr>
        <StyledDashboardNewsroomSubHdr>Story Boosts</StyledDashboardNewsroomSubHdr>
        <p>
          Story Boosts allow supporters to give you small, incremental proceeds using ETH or credit cards. When you add
          the Story Boost embed, your stories will be included on the Civil storyfeed and you will be able to collect
          proceeds from the feed as well as your own site.
        </p>
        <p>
          Place the following code in your CMS where you'd like a Story Boost to be displayed on your site. You can add
          it to each story or your CMS template.
        </p>
        <StyledEmbedCode>{storyBoostEmbed}</StyledEmbedCode>
        <InvertedButton size={buttonSizes.MEDIUM_WIDE} onClick={() => setCopied(copyToClipboard(storyBoostEmbed))}>
          Copy
        </InvertedButton>{" "}
        {copied && "Copied!"}
        <p>
          Use WordPress? You can download and install the Story Boost plugin to automatically embed Story Boosts on your
          site.
        </p>
        <p>
          Download this zip file, navigate to the Plugins page in your admin dashboard, select Add New, then Upload
          Plugin.
        </p>
        <InvertedButton
          size={buttonSizes.MEDIUM_WIDE}
          to={"https://drive.google.com/uc?export=download&id=1Rq4ZW-gwDMy5TLIr_aKJzFUYnSIVXpC6"}
        >
          Download Story Boost Plugin
        </InvertedButton>
        <FeatureFlag feature={"pew"}>
          <Query<any>
            query={CHANNEL_ID_FROM_NEWSROOM_ADDRESS_QUERY}
            variables={{ contractAddress: props.newsroomAddress }}
          >
            {({ loading, error, data }) => {
              if (loading || error) {
                return <></>;
              }
              return (
                <>
                  <StyledDashboardNewsroomTerHdr>Submit a Story</StyledDashboardNewsroomTerHdr>
                  <DashboardNewsroomSubmitLink channelID={data.channelsGetByNewsroomAddress.id} />
                </>
              );
            }}
          </Query>
        </FeatureFlag>
        <StyledDashboardNewsroomTerHdr>Proceeds collected from Story Boosts</StyledDashboardNewsroomTerHdr>
        <NewsroomProceeds newsroomAddress={props.newsroomAddress} boostType={"externallink"} />
        <StyledDashboardNewsroomBorder />
        <StyledDashboardNewsroomSubHdr>Project Boosts</StyledDashboardNewsroomSubHdr>
        <p>
          Project Boosts lets your newsroom host one-off fundraisers anywhere on your website to fund and produce larger
          journalism projects. Share your vision and how the money will be used so your readers can get behind it.
        </p>
        <p>
          You can embed Projects Boosts on your site as well. You just need to copy the embed from each Project Boost.{" "}
          <a href={urlConstants.FAQ_BOOSTS} target="_blank">
            Learn more
          </a>
        </p>
        {/*@TODO Because we're in components we can't access dapp routes so we have to hard code the route*/}
        <p>
          <InvertedButton size={buttonSizes.MEDIUM_WIDE} to={`/manage-newsroom/${props.newsroomAddress}/launch-boost`}>
            Launch a New Project Boost
          </InvertedButton>
        </p>
        <p>
          <InvertedButton size={buttonSizes.MEDIUM_WIDE} to={`${props.listingDetailURL}/boosts`}>
            View your Project Boosts
          </InvertedButton>
        </p>
        <StyledDashboardNewsroomTerHdr>Proceeds collected from Project Boosts</StyledDashboardNewsroomTerHdr>
        <NewsroomProceeds newsroomAddress={props.newsroomAddress} boostType={"boost"} />
      </StyledDashboardNewsroomSection>
      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomHdr>Payments</StyledDashboardNewsroomHdr>
        {/*@HACK We need to include `NewsroomWithdraw` from `sdk` package, but this component is in `components` package which `sdk` uses so we'd have a circular dependency. @TODO/tobek all these TCR dashboard components should be moved into `dapp` package.*/}
        {props.boostProceeds}
        <StyledDashboardNewsroomBorder />
        <StyledDashboardNewsroomSubHdr>Set Up Credit Card Payments</StyledDashboardNewsroomSubHdr>
        <p>
          Connect a Stripe account to accept Credit Cards payments for your Boosts. You can link your existing Stripe
          account or start a new one. Any payments sent with credit cards with automatically be deposited into your
          Stripe account.
        </p>
        <FeatureFlag feature={"stripe-admin"}>
          <DashboardNewsroomStripeConnect newsroomAddress={props.newsroomAddress} />
        </FeatureFlag>
      </StyledDashboardNewsroomSection>
    </StyledDashboardNewsroom>
  );
};

export const DashboardNewsroom = React.memo(DashboardNewsroomBase);
