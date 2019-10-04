import * as React from "react";
import { CivilLogo, colors } from "@joincivil/elements";
import { NavMenu } from "./NavMenu";
import { NavContainer, NavOuter, NavLogo, NavInner, NavInnerRight } from "./styledComponents";

const UserAccountContainer = React.lazy(async () => import("./UserAccountContainer"));

export interface NavBarProps {
  showUser?: boolean;
}

export const NavBar: React.FunctionComponent<NavBarProps> = ({ showUser }) => {
  return (
    <NavContainer>
      <NavOuter>
        <NavInner>
          <NavLogo>
            <a href="https://civil.co">
              <CivilLogo color={colors.basic.WHITE} />
            </a>
          </NavLogo>

          <NavMenu />
        </NavInner>

        <NavInnerRight>{showUser ? <UserAccountContainer /> : null}</NavInnerRight>
      </NavOuter>
    </NavContainer>
  );
};
