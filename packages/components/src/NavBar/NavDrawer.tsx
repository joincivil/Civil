import * as React from "react";
import * as ReactDOM from "react-dom";
import { buttonSizes } from "../Button";

import {
  StyledNavDrawer,
  NavDrawerSection,
  NavDrawerSectionHeader,
  NavDrawerRow,
  NavDrawerRowLabel,
  NavDrawerRowInfo,
  NavDrawerPill,
  NavDrawerCvlBalance,
  UserAddress,
  NavDrawerBuyCvlBtn,
  CopyButton,
} from "./styledComponents";
import {
  NavDrawerUserAddessText,
  NavDrawerBalanceText,
  NavDrawerTotalBalanceText,
  NavDrawerVotingBalanceText,
  NavDrawerVotingBalanceToolTipText,
  NavDrawerCopyBtnText,
  NavDrawerBuyCvlBtnText,
  NavDrawerDashboardText,
  NavDrawerRevealVotesText,
  NavDrawerClaimRewardsText,
  NavDrawerSubmittedChallengesText,
  NavDrawerVotedChallengesText,
  NavDrawerLoadingPrefText,
} from "./textComponents";
import { QuestionToolTip } from "../QuestionToolTip";
import { LoadingPrefToggle } from "./LoadingPrefToggle";

export interface NavDrawerProps {
  balance: string;
  votingBalance: string;
  userAccount: string;
  userRevealVotesCount?: number;
  userChallengesVotedOnCount?: number;
  userChallengesStartedCount?: number;
  userClaimRewardsCount?: number;
  buyCvlUrl?: string;
  useGraphQL: boolean;
  onLoadingPrefToggled(): void;
}

class NavDrawerComponent extends React.Component<NavDrawerProps> {
  public render(): JSX.Element {
    return (
      <StyledNavDrawer>
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
          <NavDrawerRowLabel>
            <NavDrawerLoadingPrefText />
          </NavDrawerRowLabel>
          <LoadingPrefToggle onClick={this.props.onLoadingPrefToggled} useGraphQL={this.props.useGraphQL} />
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
              <QuestionToolTip explainerText={<NavDrawerVotingBalanceToolTipText />} />
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
      </StyledNavDrawer>
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

export class NavDrawer extends React.Component<NavDrawerProps> {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(<NavDrawerComponent {...this.props} />, this.bucket);
  }
}
