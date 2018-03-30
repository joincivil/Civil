import * as React from "react";
import styled from "styled-components";
import { Civil } from "@joincivil/core";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
  border-bottom: 2px solid black;
`;

export interface HeaderState {
  balance: string;
}

class Header extends React.Component<{}, HeaderState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      balance: "loading...",
    };
  }

  public componentWillMount(): void {
    window.addEventListener("load", this.initHeader);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("load", this.initHeader);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        Balance: {this.state.balance}
      </StyledDiv>
    );
  }

  private initHeader = () => {
    const civil = new Civil();
    const token = civil.getEIP20ForDeployedTCR();
    const instance = this;
    token.then((t) => {
      t.getBalance(civil.userAccount).then((balance) => {
        instance.setState({balance: balance.toString()});
      }).catch();
    }).catch();
  }
}

export default Header;
