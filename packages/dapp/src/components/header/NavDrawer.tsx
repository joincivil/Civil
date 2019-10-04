import * as React from "react";
import * as ReactDOM from "react-dom";
import { buttonSizes, Button } from "@joincivil/elements";

// import { QuestionToolTip } from "../QuestionToolTip";

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
  // NavDrawerVotingBalanceToolTipText,
  NavDrawerCopyBtnText,
  NavDrawerBuyCvlBtnText,
  NavDrawerDashboardText,
  NavDrawerRevealVotesText,
  NavDrawerClaimRewardsText,
  NavDrawerSubmittedChallengesText,
  NavDrawerVotedChallengesText,
} from "./textComponents";
import { ICivilContext, CivilContext } from "@joincivil/components";
import { getFormattedEthAddress, getFormattedTokenBalance } from "@joincivil/utils";
import { useSelector } from "react-redux";
import { routes } from "../../constants";
import { State } from "../../redux/reducers";

import {
  getChallengesStartedByUser,
  getChallengesVotedOnByUser,
  getUserChallengesWithUnrevealedVotes,
  getUserChallengesWithUnclaimedRewards,
} from "../../selectors";

export interface NavDrawerProps {
  userAccountElRef?: any;
  handleOutsideClick(): void;
}

function maybeAccount(state: State): any {
  const { user } = state.networkDependent;
  if (user.account && user.account.account && user.account.account !== "") {
    return user.account;
  }
}

export const NavDrawerComponent: React.FunctionComponent<NavDrawerProps> = props => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const account: any | undefined = useSelector(maybeAccount);
  const currentUserChallengesStarted = useSelector(getChallengesStartedByUser);
  const currentUserChallengesVotedOn = useSelector(getChallengesVotedOnByUser);
  const userChallengesWithUnrevealedVotes = useSelector(getUserChallengesWithUnrevealedVotes);
  const userChallengesWithUnclaimedRewards = useSelector(getUserChallengesWithUnclaimedRewards);
  const userAccount = account ? account.account : undefined;
  const userEthAddress = userAccount && getFormattedEthAddress(userAccount);
  const balance = account ? getFormattedTokenBalance(account.balance) : "loading...";
  const votingBalance = account ? getFormattedTokenBalance(account.votingBalance) : "loading...";

  const buyCvlUrl = "/tokens";

  async function onLogoutPressed(): Promise<any> {
    civilContext.auth.logout();
  }

  const userRevealVotesCount = userChallengesWithUnrevealedVotes!.count();
  const userClaimRewardsCount = userChallengesWithUnclaimedRewards!.count();
  const userChallengesStartedCount = currentUserChallengesStarted.count();
  const userChallengesVotedOnCount = currentUserChallengesVotedOn.count();

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
        <CopyButton size={buttonSizes.SMALL} onClick={(ev: any) => copyToClipBoard()}>
          <NavDrawerCopyBtnText />
        </CopyButton>
      </NavDrawerSection>
      <NavDrawerSection>
        <Button size={buttonSizes.SMALL} to={routes.DASHBOARD_ROOT}>
          View My Dashboard
        </Button>
      </NavDrawerSection>
      <NavDrawerSection>
        <Button size={buttonSizes.SMALL} onClick={onLogoutPressed}>
          Logout
        </Button>
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
            {/* TODO(dankins): move ToolTip into elements and add this back */}
            {/* <QuestionToolTip explainerText={<NavDrawerVotingBalanceToolTipText />} /> */}
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
    </StyledNavDrawer>
  );

  function copyToClipBoard(): void {
    const textArea = document.createElement("textarea");
    textArea.innerText = userEthAddress.replace(/ /g, "");
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }
};

class NavDrawer extends React.Component<NavDrawerProps> {
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

export default NavDrawer;
