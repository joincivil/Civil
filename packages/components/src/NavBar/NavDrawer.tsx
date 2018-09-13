import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button, buttonSizes } from "../Button";
import {
  NavDrawerUserAddessText,
  NavDrawerBalanceText,
  NavDrawerTotalBalanceText,
  NavDrawerVotingBalanceText,
  NavDrawerCopyBtnText,
  NavDrawerBuyCvlBtnText,
  NavDrawerDashboardText,
  NavDrawerRevealVotesText,
  NavDrawerClaimRewardsText,
  NavDrawerSubmittedChallengesText,
  NavDrawerVotedChallengesText,
} from "./textComponents";

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

const UserAddress = styled.span`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.MONOSPACE};
  font-size: 16px;
  font-weight: 800;
  line-height: 26px;
  word-wrap: break-word;
`;

const NavDrawerBuyCvlBtn = Button.extend`
  font-weight: 600;
  margin-top: 20px;
  padding: 15px;
  text-align: center;
  width: 100%;
`;

const CopyButton = Button.extend`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 10px;
  padding: 5px;
`;

export interface NavDrawerProps {
  balance: string;
  votingBalance: string;
  userAccount: string;
  userRevealVotesCount?: number;
  userChallengesVotedOnCount?: number;
  userChallengesStartedCount?: number;
  userClaimRewardsCount?: number;
  buyCvlUrl?: string;
}

export class NavDrawerComponent extends React.Component<NavDrawerProps> {
  public render(): JSX.Element {
    return (
      <NavDrawer>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerUserAddessText />
          </NavDrawerSectionHeader>
          <UserAddress>{this.props.userAccount}</UserAddress>
          <CopyButton size={buttonSizes.SMALL} onClick={ev => this.copyToClipBoard()}>
            <NavDrawerCopyBtnText />
          </CopyButton>
        </NavDrawerSection>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerBalanceText />
          </NavDrawerSectionHeader>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerTotalBalanceText />
            </NavDrawerRowLabel>
            <NavDrawerRowInfo>
              <NavDrawerCvlBalance>{this.props.balance}</NavDrawerCvlBalance>
            </NavDrawerRowInfo>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerVotingBalanceText />
            </NavDrawerRowLabel>
            <NavDrawerRowInfo>
              <NavDrawerCvlBalance>{this.props.votingBalance}</NavDrawerCvlBalance>
            </NavDrawerRowInfo>
          </NavDrawerRow>
          <NavDrawerBuyCvlBtn size={buttonSizes.SMALL} href={this.props.buyCvlUrl}>
            <NavDrawerBuyCvlBtnText />
          </NavDrawerBuyCvlBtn>
        </NavDrawerSection>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerDashboardText />
          </NavDrawerSectionHeader>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerRevealVotesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userRevealVotesCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerClaimRewardsText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userClaimRewardsCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerSubmittedChallengesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userChallengesStartedCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerVotedChallengesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{this.props.userChallengesVotedOnCount || 0}</NavDrawerPill>
          </NavDrawerRow>
        </NavDrawerSection>
      </NavDrawer>
    );
  }

  private copyToClipBoard = () => {
    const textArea = document.createElement("textarea");
    const userAccount = this.props.userAccount || "";
    textArea.innerText = userAccount;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };
}
