import { getFormattedTokenBalance } from "@joincivil/utils";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { State } from "../reducers";
import { NavBar } from "@joincivil/components";

const StyledErrorBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 0;
  height: 30px;
  background-color: red;
`;

export interface NavBarProps {
  balance: string;
  votingBalance: string;
  network: string;
}

class NavBarComponent extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
  }

  public render(): JSX.Element {
    const shouldRenderErrorBar = this.props.network !== "4";
    return (
      <>
        <NavBar balance={this.props.balance} votingBalance={this.props.votingBalance} />
        {shouldRenderErrorBar && <StyledErrorBar>PLEASE SWITCH TO RINKEBY TESTNET</StyledErrorBar>}
      </>
    );
  }
}
const mapStateToProps = (state: State): NavBarProps => {
  const { networkDependent, network } = state;

  let balance = "loading...";
  if (networkDependent.user.account && networkDependent.user.account.balance) {
    balance = getFormattedTokenBalance(networkDependent.user.account.balance);
  }

  let votingBalance = "";
  if (networkDependent.user.account && networkDependent.user.account.votingBalance) {
    votingBalance = getFormattedTokenBalance(networkDependent.user.account.votingBalance);
  }

  return { balance, votingBalance, network };
};

export const GlobalNavBar = connect(mapStateToProps)(NavBarComponent);
