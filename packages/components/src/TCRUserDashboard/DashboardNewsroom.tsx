import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { EthAddressViewer } from "../EthAddressViewer";

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
  isRejected?: boolean;
  acceptedDate?: string;
  inProgressPhaseDisplayName?: string;
  inProgressPhaseCountdown?: JSX.Element;
  inProgressPhaseDetails?: string | JSX.Element;
  rejectedDate?: string;
}

const DashboardNewsroomRegistryStatus: React.FunctionComponent<DashboardNewsroomProps> = props => {
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

export const DashboardNewsroom: React.FunctionComponent<DashboardNewsroomProps> = props => {
  return (
    <StyledDashboardNewsroom>
      <StyledDashboardNewsroomSection>
        <StyledDashboardNewsroomSectionContentRow>
          <StyledDashboardNewsroomName>{props.newsroomName}</StyledDashboardNewsroomName>

          <StyledDashboardNewsroomLinks>
            <Link to={props.listingDetailURL}>View on Registry</Link>

            <Link to={props.editNewsroomURL}>Edit</Link>
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
