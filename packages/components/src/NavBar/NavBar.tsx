import * as React from "react";
import { colors } from "../styleConstants";
import { NavMenu } from "./NavMenu";
import { CivilLogo } from "../CivilLogo";

import { NavContainer, NavOuter, NavLogo, NavInner, NavInnerRight } from "./styledComponents";

export interface NavBarUserAccountElProps {
  userAccountEl: JSX.Element;
}

export const NavBar: React.FunctionComponent<NavBarUserAccountElProps> = props => {
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

        <NavInnerRight>{props.userAccountEl}</NavInnerRight>
      </NavOuter>
    </NavContainer>
  );
};
