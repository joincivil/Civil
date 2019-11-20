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
import { Button, buttonSizes } from "../Button";

export interface DashboardUserInfoSummaryProps {
  userAccount: string;
  balance: string;
  votingBalance: string;
  challengesWonTotalCvl?: string;
  rewardsEarned?: string;
  buyCvlUrl: string;
}

export const DashboardUserInfoSummary = (props: DashboardUserInfoSummaryProps) => {
  const { buyCvlUrl, challengesWonTotalCvl, rewardsEarned } = props;

  let buyBtnProps: any = { href: buyCvlUrl };
  if (buyCvlUrl.charAt(0) === "/") {
    buyBtnProps = { to: buyCvlUrl };
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

      {challengesWonTotalCvl && (
        <StyledUserInfoSection>
          <>
            <StyledUserInfoSectionLabel>
              <ChallengesWonLabelText />
            </StyledUserInfoSectionLabel>
            <StyledUserInfoSectionValue>
              <strong>{challengesWonTotalCvl}</strong>
            </StyledUserInfoSectionValue>
          </>
        </StyledUserInfoSection>
      )}

      {rewardsEarned && (
        <StyledUserInfoSection>
          <>
            <StyledUserInfoSectionLabel>
              <RewardsClaimedLabelText />
            </StyledUserInfoSectionLabel>
            <StyledUserInfoSectionValue>
              <strong>{rewardsEarned}</strong>
            </StyledUserInfoSectionValue>
          </>
        </StyledUserInfoSection>
      )}

      <StyledUserInfoButtonSection>
        <Button size={buttonSizes.MEDIUM_WIDE} {...buyBtnProps}>
          Buy or Sell Civil Tokens
        </Button>
      </StyledUserInfoButtonSection>
    </StyledUserInfo>
  );
};
