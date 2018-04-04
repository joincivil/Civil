import * as React from "react";
import styled from "styled-components";
import { Civil, CivilErrors } from "@joincivil/core";
import NavBarItem from "./NavBarItem";
import NavBarLink from "./NavBarLink";
import NavBarSpan from "./NavBarSpan";

const StyledUL = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-top: 0;
  padding: 0;
  height: 50px;
  background-color: black;
`;

export interface NavBarState {
  balance: string;
}

class NavBar extends React.Component<{}, NavBarState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      balance: "loading....",
    };
  }

  public componentWillMount(): void {
    window.addEventListener("load", this.initNavBar);
  }

  public componentWillUnmount(): void {
    window.removeEventListener("load", this.initNavBar);
  }

  public render(): JSX.Element {
    return (
        <StyledUL>
          <NavBarItem>
            <NavBarLink to="/" big={true}>
              C I V I L
            </NavBarLink>
          </NavBarItem>
          <NavBarItem>
            <NavBarLink to="registry">
              Registry
            </NavBarLink>
          </NavBarItem>
          <NavBarItem>
            <NavBarLink to="constitution">
              Constitution
            </NavBarLink>
          </NavBarItem>
          <NavBarItem>
            <NavBarLink to="about">
              About
            </NavBarLink>
          </NavBarItem>
          <NavBarItem right={true}>
            <NavBarSpan>
              {"Your Balance: " + this.state.balance}
            </NavBarSpan>
          </NavBarItem>
        </StyledUL>
    );
  }

  private initNavBar = () => {
    const civil = new Civil();
    const token = civil.getEIP20ForDeployedTCR();
    token.then(async (t) => {
      return t.getBalance(civil.userAccount).then((balance) => {
        this.setState({balance: balance.toString()});
      });
    }).catch((ex) => {
      if (ex === CivilErrors.NoUnlockedAccount) {
        this.setState({balance: "No Unlocked Account Found. Unlock MetaMask and Reload."});
       }
    });
  }
}

export default NavBar;
