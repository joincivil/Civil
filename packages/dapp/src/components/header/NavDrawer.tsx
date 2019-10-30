import * as React from "react";
import * as ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { ICivilContext, CivilContext } from "@joincivil/components";
import { copyToClipboard, getFormattedEthAddress, getFormattedTokenBalance } from "@joincivil/utils";
import { buttonSizes, Button } from "@joincivil/elements";

// import { QuestionToolTip } from "../QuestionToolTip";

import {
  StyledNavDrawer,
  NavDrawerSection,
  NavDrawerSectionHeader,
  NavDrawerRow,
  NavDrawerRowLabel,
  NavDrawerRowInfo,
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
} from "./textComponents";
import { routes } from "../../constants";
import { State } from "../../redux/reducers";

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
  const userAccount = account ? account.account : undefined;
  const userEthAddress = userAccount && getFormattedEthAddress(userAccount);
  const balance = account ? getFormattedTokenBalance(account.balance) : "loading...";
  const votingBalance = account ? getFormattedTokenBalance(account.votingBalance) : "loading...";

  const buyCvlUrl = "/tokens";

  async function onLogoutPressed(): Promise<any> {
    civilContext.auth.logout();
  }

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
        <CopyButton size={buttonSizes.SMALL} onClick={(ev: any) => copyToClipboard(userEthAddress.replace(/ /g, ""))}>
          <NavDrawerCopyBtnText />
        </CopyButton>
      </NavDrawerSection>
      <NavDrawerSection>
        <Button size={buttonSizes.SMALL} to={routes.DASHBOARD_ROOT}>
          View My Dashboard
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
        <Button size={buttonSizes.SMALL} onClick={onLogoutPressed}>
          Logout
        </Button>
      </NavDrawerSection>
    </StyledNavDrawer>
  );
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
