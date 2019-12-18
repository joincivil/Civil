import * as React from "react";
import { CivilLogo, colors } from "@joincivil/elements";
import { NavMenu } from "./NavMenu";
import { NavContainer, NavOuter, NavLogo, NavInner, NavInnerRight } from "./styledComponents";

const UserAccountContainer = React.lazy(async () =>
  import(/* webpackChunkName: "user-account-container" */ "./UserAccountContainer"),
);

export const NavBar: React.FunctionComponent = () => {
  return (
    <NavContainer>
      <NavOuter>
        <NavInner>
          <NavLogo>
            <a href="https://civil.co">
              <CivilLogo color={colors.basic.WHITE} preventBlueOnHover={true}/>
            </a>
          </NavLogo>

          <NavMenu />
        </NavInner>

        <NavInnerRight>{<UserAccountContainer />}</NavInnerRight>
      </NavOuter>
    </NavContainer>
  );
};
