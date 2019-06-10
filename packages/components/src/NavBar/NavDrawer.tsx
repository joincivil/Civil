import * as React from "react";
import * as ReactDOM from "react-dom";
import { buttonSizes, Button, InvertedButton } from "../Button";

import { LoadUser } from "../Account";
import { QuestionToolTip } from "../QuestionToolTip";

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
import { LoadingPrefToggle } from "./LoadingPrefToggle";
import { NavUserAccountProps, NavDrawerProps as NavDrawerBaseProps } from "./NavBarTypes";

export interface NavDrawerProps extends NavDrawerBaseProps, NavUserAccountProps {
  userAccountElRef?: any;
  handleOutsideClick(): void;
}

class NavDrawerComponent extends React.Component<NavDrawerProps> {
  public render(): JSX.Element {
    const {
      userEthAddress,
      onLoadingPrefToggled,
      useGraphQL,
      balance,
      votingBalance,
      buyCvlUrl,
      userRevealVotesCount,
      userClaimRewardsCount,
      userChallengesStartedCount,
      userChallengesVotedOnCount,
    } = this.props;

    if (!userEthAddress) {
      return <></>;
    }

    let buyCvlBtnProps: any = { href: buyCvlUrl };
    if (buyCvlUrl.charAt(0) === "/") {
      buyCvlBtnProps = { to: buyCvlUrl };
    }

    return (
      <StyledNavDrawer>
        <NavDrawerSection>
          <NavDrawerSectionHeader>
            <NavDrawerUserAddessText />
          </NavDrawerSectionHeader>
          <UserAddress>{userEthAddress}</UserAddress>
          <CopyButton size={buttonSizes.SMALL} onClick={(ev: any) => this.copyToClipBoard()}>
            <NavDrawerCopyBtnText />
          </CopyButton>
        </NavDrawerSection>
        <NavDrawerSection>
          <NavDrawerRowLabel>
            <NavDrawerLoadingPrefText />
          </NavDrawerRowLabel>
          <LoadingPrefToggle onClick={onLoadingPrefToggled} useGraphQL={useGraphQL} />
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
              <NavDrawerCvlBalance>{balance}</NavDrawerCvlBalance>
            </NavDrawerRowInfo>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerVotingBalanceText />
              <QuestionToolTip explainerText={<NavDrawerVotingBalanceToolTipText />} />
            </NavDrawerRowLabel>
            <NavDrawerRowInfo>
              <NavDrawerCvlBalance>{votingBalance}</NavDrawerCvlBalance>
            </NavDrawerRowInfo>
          </NavDrawerRow>
          <NavDrawerBuyCvlBtn size={buttonSizes.SMALL} {...buyCvlBtnProps}>
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
            <NavDrawerPill>{userRevealVotesCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerClaimRewardsText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{userClaimRewardsCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerSubmittedChallengesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{userChallengesStartedCount || 0}</NavDrawerPill>
          </NavDrawerRow>
          <NavDrawerRow>
            <NavDrawerRowLabel>
              <NavDrawerVotedChallengesText />
            </NavDrawerRowLabel>
            <NavDrawerPill>{userChallengesVotedOnCount || 0}</NavDrawerPill>
          </NavDrawerRow>
        </NavDrawerSection>
        <NavDrawerSection>
          <Button to={"/auth/logout"} size={buttonSizes.SMALL}>
            Logout
          </Button>
        </NavDrawerSection>
      </StyledNavDrawer>
    );
  }

  private copyToClipBoard = () => {
    const textArea = document.createElement("textarea");
    const userEthAddress = this.props.userEthAddress || "";
    textArea.innerText = userEthAddress.replace(/ /g, "");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };
}

class NavDrawerBucketComponent extends React.Component<NavDrawerProps> {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
    document.addEventListener("mousedown", this.handleClick, false);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(<NavDrawerComponent {...this.props} />, this.bucket);
  }

  private handleClick = (event: any) => {
    const toggleEl = this.props.userAccountElRef && this.props.userAccountElRef.current;
    if (
      this.bucket.contains(event.target) ||
      ((toggleEl && toggleEl.contains(event.target)) || event.target === toggleEl)
    ) {
      return;
    }

    this.props.handleOutsideClick();
  };
}

const NavDrawer: React.FunctionComponent<NavDrawerProps> = props => {
  return (
    <LoadUser>
      {({ loading, user: civilUser }) => {
        if (loading || !civilUser || !props.userEthAddress) {
          return null;
        }

        return <NavDrawerBucketComponent {...props} />;
      }}
    </LoadUser>
  );
};

export default NavDrawer;
