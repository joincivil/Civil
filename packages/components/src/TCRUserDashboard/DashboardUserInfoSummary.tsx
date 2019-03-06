import * as React from "react";
import {
  StyledUserInfo,
  StyledUserInfoSection,
  StyledUserInfoButtonSection,
  StyledUserInfoSectionLabel,
  StyledUserInfoSectionValue,
  StyledUserAddress,
} from "./DashboardStyledComponents";
import {
  YourPublicAddressLabelText,
  BalanceLabelText,
  VotingBalanceLabelText,
  ChallengesWonLabelText,
  RewardsClaimedLabelText,
} from "./DashboardTextComponents";
import { Button, InvertedButton, buttonSizes } from "../Button";

export interface DashboardUserInfoSummaryProps {
  userAccount: string;
  balance: string;
  votingBalance: string;
  challengesWonTotalCvl: string;
  rewardsEarned: string;
  buyCvlUrl: string;
  applyURL: string;
}

export const DashboardUserInfoSummary: React.StatelessComponent<DashboardUserInfoSummaryProps> = props => {
  const { buyCvlUrl, applyURL } = props;

  let buyBtnProps: any = { href: buyCvlUrl };
  if (buyCvlUrl.charAt(0) === "/") {
    buyBtnProps = { to: buyCvlUrl };
  }
  let applyBtnProps: any = { href: applyURL };
  if (applyURL.charAt(0) === "/") {
    applyBtnProps = { to: applyURL };
  }

  return (
    <StyledUserInfo>
      <StyledUserInfoSectionLabel>
        <YourPublicAddressLabelText />
      </StyledUserInfoSectionLabel>
      <StyledUserAddress>{props.userAccount}</StyledUserAddress>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>
          <BalanceLabelText />
        </StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.balance}</strong>
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>
          <VotingBalanceLabelText />
        </StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.votingBalance}</strong>
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>
          <ChallengesWonLabelText />
        </StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.challengesWonTotalCvl}</strong>
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>
          <RewardsClaimedLabelText />
        </StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.rewardsEarned}</strong>
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoButtonSection>
        <Button size={buttonSizes.MEDIUM_WIDE} {...buyBtnProps}>
          Buy or Sell Civil Tokens
        </Button>

        <InvertedButton size={buttonSizes.MEDIUM_WIDE} {...applyBtnProps}>
          Join as a newsroom
        </InvertedButton>
      </StyledUserInfoButtonSection>
    </StyledUserInfo>
  );
};
