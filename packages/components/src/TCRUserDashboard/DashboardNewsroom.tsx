import * as React from "react";
import { Link } from "react-router-dom";
import { EthAddressViewer } from "../EthAddressViewer";
import { ErrorIcon } from "../icons";

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

export interface DashboardNewsroomProps {
  newsroomName: string;
  newsroomAddress: string;
  newsroomMultiSigAddress: string;
  newsroomMultiSigBalance: string;
  listingDetailURL: string;
  editNewsroomURL: string;
  newsroomDeposit: string;
  etherscanBaseURL: string;
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

    return <Link to={props.editNewsroomURL}>Edit</Link>;
  };

  return (
    <StyledDashboardNewsroom>
      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomSectionContentRow>
          <StyledDashboardNewsroomName>{props.newsroomName}</StyledDashboardNewsroomName>

          <StyledDashboardNewsroomLinks>
            <Link to={props.listingDetailURL}>View on Registry</Link>

            {renderEditLink()}
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
        <EthAddressViewer
          address={props.newsroomMultiSigAddress}
          displayName="Newsroom Public Wallet Address"
          etherscanBaseURL={props.etherscanBaseURL}
        />

        <EthAddressViewer
          address={props.newsroomAddress}
          displayName="Newsroom Smart Contract Address"
          etherscanBaseURL={props.etherscanBaseURL}
        />
      </StyledDashboardNewsroomSection>
    </StyledDashboardNewsroom>
  );
};

export const DashboardNewsroom = React.memo(DashboardNewsroomBase);
