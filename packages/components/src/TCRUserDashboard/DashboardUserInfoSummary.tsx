import * as React from "react";
import {
  StyledDashboardActivityDescription,
  StyledUserInfo,
  StyledUserInfoSection,
  StyledUserInfoSectionLabel,
  StyledUserInfoSectionValue,
  StyledUserAddress,
} from "./styledComponents";
import {
  YourPublicAddressLabelText,
  BalanceLabelText,
  VotingBalanceLabelText,
  ChallengesWonLabelText,
  RewardsClaimedLabelText,
} from "./textComponents";
import { EthAddress } from "@joincivil/core";
import { colors } from "../styleConstants";
import { Button } from "../Button";

export interface DashboardUserInfoSummaryProps {
  userAccount: string;
  balance: string;
  votingBalance: string;
  challengesWonTotalCvl: string;
  rewardsEarned: string;
  buyCVLURL: string;
}

export const DashboardUserInfoSummary: React.StatelessComponent<DashboardUserInfoSummaryProps> = props => {
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

      <StyledUserInfoSection>
        <StyledUserInfoSectionValue>
          <Button href={props.buyCVLURL} target="_blank">
            Buy CVL
          </Button>
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>
    </StyledUserInfo>
  );
};
