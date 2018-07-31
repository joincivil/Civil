import * as React from "react";
import styled from "styled-components";
import { EthAddress } from "@joincivil/core";
import { colors } from "../styleConstants";

const StyledUserInfo = styled.div`
  width: 277px;
`;

const StyledUserInfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 22px 0 0;
  margin: 22px 0 0;

  & ~ & {
    border-top: 1px solid ${colors.basic.WHITE};
  }

  & a {
    color: ${colors.basic.WHITE};
    text-align: right;
  }
`;

// 'b3' is a hexidecimal number that equals  0.7 alpha
const StyledUserInfoSectionLabel = styled.div`
  color: ${colors.basic.WHITE}b3;
  font-size: 18px;
  line-height: 21px;
`;

// 'b3' is a hexidecimal number that equals  0.7 alpha
const StyledUserInfoSectionValue = styled.div`
  color: ${colors.basic.WHITE}b3;
  font-size: 14px;
  line-height: 19px;
  text-align: right;

  & strong {
    color: ${colors.basic.WHITE};
    display: block;
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
  }
`;

const StyledUserAddress = styled.div`
  font-size: 16px;
  line-height: 19px;
`;

export interface DashboardUserInfoSummaryProps {
  userAccount: EthAddress;
  balance: string;
  votingBalance: string;
  rewardsEarned: string;
  buyCVLURL: string;
}

export const DashboardUserInfoSummary: React.StatelessComponent<DashboardUserInfoSummaryProps> = props => {
  return (
    <StyledUserInfo>
      <StyledUserAddress>{props.userAccount}</StyledUserAddress>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>Balance</StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.balance}</strong>
          xxx USD xxx ETH
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>Voting balance</StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.votingBalance}</strong>
          xxx USD xxx ETH
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoSection>
        <StyledUserInfoSectionLabel>Rewards earned</StyledUserInfoSectionLabel>
        <StyledUserInfoSectionValue>
          <strong>{props.rewardsEarned}</strong>
          xxx USD xxx ETH
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>

      <StyledUserInfoSection>
        <StyledUserInfoSectionValue>
          <a href={props.buyCVLURL} target="blank">
            Buy CVL
          </a>
        </StyledUserInfoSectionValue>
      </StyledUserInfoSection>
    </StyledUserInfo>
  );
};
