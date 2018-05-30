import * as React from "react";
import styled from "styled-components";
import { Civil, CivilErrors } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";
import NavBarItem from "./NavBarItem";
import NavBarLink from "./NavBarLink";
import NavBarSpan from "./NavBarSpan";
import { connect } from "react-redux";
import { State } from "../../reducers";

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

export interface NavBarProps {
  balance: string;
}

class NavBar extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
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
          <NavBarLink to="/registry">Registry</NavBarLink>
        </NavBarItem>
        <NavBarItem>
          <NavBarLink to="/constitution">Constitution</NavBarLink>
        </NavBarItem>
        <NavBarItem>
          <NavBarLink to="/about">About</NavBarLink>
        </NavBarItem>
        <NavBarItem>
          <NavBarLink to="/contracts">Contracts</NavBarLink>
        </NavBarItem>
        <NavBarItem>
          <NavBarLink to="/editor">Editor</NavBarLink>
        </NavBarItem>
        <NavBarItem>
          <NavBarLink to="/parameterizer">Parameterizer</NavBarLink>
        </NavBarItem>
        <NavBarItem right={true}>
          <NavBarLink to="/createNewsroom">Create Newsroom</NavBarLink>
        </NavBarItem>
        <NavBarItem right={true}>
          <NavBarSpan>{"Your Balance: " + this.props.balance}</NavBarSpan>
        </NavBarItem>
      </StyledUL>
    );
  }
}
const mapStateToProps = (
  state: State,
): NavBarProps => {
  const { user } = state;

  let balance = "loading...";
  if (user.account && user.account.balance) {
    balance = getFormattedTokenBalance(user.account.balance);
  }
  return { balance }
}

export default connect(mapStateToProps)(NavBar);
