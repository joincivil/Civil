import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

const NavBarDrawer = styled.div`
  align-items: center;
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_1};
  color: ${colors.basic.WHITE};
  display: flex;
  height: 30px;
  justify-content: center;
  margin-left: 15px;
  width: 250px;
`;

export class NavBarDrawerComponent extends React.Component {
  public render(): JSX.Element {
    return <NavBarDrawer>CVL</NavBarDrawer>;
  }
}
