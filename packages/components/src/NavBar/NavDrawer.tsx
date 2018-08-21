import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, buttonSizes } from "../Button";

const NavDrawer = styled.div`
  background-color: ${colors.primary.BLACK};
  right: 0;
  min-height: 100%;
  position: absolute;
  top: 62px;
  width: 275px;
  z-index: 1;
  * {
    box-sizing: border-box;
  }
`;

const NavDrawerSection = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_1};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 25px;
`;

const NavDrawerSectionHeader = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.92px;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const NavDrawerRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const NavDrawerRowLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
`;

const NavDrawerRowInfo = styled.div`
  text-align: right;
  width: 75%;
`;

const NavDrawerPill = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE};
  border-radius: 12px;
  color: ${colors.basic.WHITE};
  font-size: 14px;
  font-weight: 200;
  min-width: 28px;
  padding: 5px 8px;
  text-align: center;
`;

const NavDrawerCvlBalance = styled.div`
  color: ${colors.basic.WHITE};
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
`;

const NavDrawerCvlVBalance = styled.div`
  color: ${colors.accent.CIVIL_TEAL};
  font-size: 16px;
  font-weight: 600;
  line-height: 19px;
`;

const NavDrawerEthConversion = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const UserAddress = styled.span`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.COURIER};
  font-size: 16px;
  font-weight: 800;
  line-height: 26px;
  word-wrap: break-word;
`;

const NavDrawerBuyCvlBtn = Button.extend`
  margin-top: 20px;
  padding: 15px;
  text-align: center;
  width: 100%;
`;

export interface NavDrawerProps {
  balance?: string;
  votingBalance?: string;
  userAccount?: string;
  userChallengesVotedOnCount?: string;
  userChallengesStartedCount?: string;
  ethConversion?: string;
  buyCvlUrl?: string;
}

export const NavDrawerComponent: React.StatelessComponent<NavDrawerProps> = props => {
  return (
    <NavDrawer>
      <NavDrawerSection>
        <NavDrawerSectionHeader>Your Public Address</NavDrawerSectionHeader>
        <UserAddress>{props.userAccount}</UserAddress>
      </NavDrawerSection>
      <NavDrawerSection>
        <NavDrawerSectionHeader>Balance</NavDrawerSectionHeader>
        <NavDrawerRow>
          <NavDrawerRowLabel>Total Balance</NavDrawerRowLabel>
          <NavDrawerRowInfo>
            <NavDrawerCvlBalance>{props.balance}</NavDrawerCvlBalance>
            <NavDrawerEthConversion>{props.ethConversion || "xxx USD to xxx ETH"}</NavDrawerEthConversion>
          </NavDrawerRowInfo>
        </NavDrawerRow>
        <NavDrawerRow>
          <NavDrawerRowLabel>Voting Balance</NavDrawerRowLabel>
          <NavDrawerRowInfo>
            <NavDrawerCvlVBalance>{props.votingBalance}</NavDrawerCvlVBalance>
            <NavDrawerEthConversion>{props.ethConversion || "xxx USD to xxx ETH"}</NavDrawerEthConversion>
          </NavDrawerRowInfo>
        </NavDrawerRow>
        <NavDrawerBuyCvlBtn size={buttonSizes.SMALL} href={props.buyCvlUrl}>
          Buy CVL Tokens
        </NavDrawerBuyCvlBtn>
      </NavDrawerSection>
      <NavDrawerSection>
        <NavDrawerSectionHeader>Dashboard</NavDrawerSectionHeader>
        <NavDrawerRow>
          <NavDrawerRowLabel>Submitted Challenges</NavDrawerRowLabel>
          <NavDrawerPill>{props.userChallengesStartedCount || "0"}</NavDrawerPill>
        </NavDrawerRow>
        <NavDrawerRow>
          <NavDrawerRowLabel>Challenges Voted On</NavDrawerRowLabel>
          <NavDrawerPill>{props.userChallengesVotedOnCount || "0"}</NavDrawerPill>
        </NavDrawerRow>
      </NavDrawerSection>
    </NavDrawer>
  );
};
