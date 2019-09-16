import * as React from "react";
import { Link } from "react-router-dom";
import { urlConstants } from "@joincivil/utils";
import { EthAddressViewer } from "../EthAddressViewer";
import { ErrorIcon } from "../icons";

import { Button, buttonSizes } from "../Button";
import { FeatureFlag } from "../features";
import {
  StyledDashboardNewsroom,
  StyledDashboardNewsroomName,
  StyledDashboardNewsroomSection,
  StyledDashboardNewsroomSectionContentRow,
  StyledDashboardNewsroomHdr,
  StyledChallengeIDKicker,
  StyledDashboardNewsroomLinks,
  StyledDashboardNewsroomTokensContainer,
  StyledDashboardNewsroomTokensLabel,
  StyledCVLLabel,
  StyledWarningText,
} from "./DashboardStyledComponents";
import { DashboardNewsroomStripeConnect } from "./DashboardNewsroomStripeConnect";
import { DashboardNewsroomSubmitLink } from "./DashboardNewsroomSubmitLink";

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
  rejectedDate?: string;
}

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
  const { isUnderChallenge } = props;
  const renderEditLink = () => {
    if (isUnderChallenge) {
      return (
        <StyledWarningText>
          <ErrorIcon width={16} height={16} /> Your charter is locked until the challenge period has ended.
        </StyledWarningText>
      );
    }

    return <Link to={props.manageNewsroomURL}>Manage Newsroom &gt;</Link>;
  };

  return (
    <StyledDashboardNewsroom>
      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomSectionContentRow>
          <StyledDashboardNewsroomName>{props.newsroomName}</StyledDashboardNewsroomName>

          <StyledDashboardNewsroomLinks>
            {renderEditLink()}
            <Link to={props.listingDetailURL}>View on Registry &gt;</Link>
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

      {/*<FeatureFlag feature={"pew-mvp"}>*/}
      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomHdr>Pulse</StyledDashboardNewsroomHdr>
        <DashboardNewsroomSubmitLink newsroomAddress={props.newsroomAddress} />
      </StyledDashboardNewsroomSection>
      {/*</FeatureFlag>*/}

      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomHdr>Boosts</StyledDashboardNewsroomHdr>
        <p>
          Connect with the Civil community eager to fund your newsroom projects.{" "}
          <a href={urlConstants.FAQ_BOOSTS} target="_blank">
            Learn more
          </a>
        </p>
        {/*@TODO Because we're in components we can't access dapp routes so we have to hard code the route*/}
        <p>
          <Button size={buttonSizes.MEDIUM_WIDE} to={`/manage-newsroom/${props.newsroomAddress}/launch-boost`}>
            Launch Boost
          </Button>
        </p>
        <p>
          {/*@TODO Ideally we could link directly to that tab, see CIVIL-1021*/}
          View your current Boosts on the "Boosts" tab on{" "}
          <Link to={props.listingDetailURL}>your newsroom's Registry listing</Link>.
        </p>
      </StyledDashboardNewsroomSection>

      <FeatureFlag feature={"stripe-admin"}>
        <StyledDashboardNewsroomSection>
          <DashboardNewsroomStripeConnect newsroomAddress={props.newsroomAddress} />
        </StyledDashboardNewsroomSection>
      </FeatureFlag>
    </StyledDashboardNewsroom>
  );
};

export const DashboardNewsroom = React.memo(DashboardNewsroomBase);
