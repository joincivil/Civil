import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

const ErrorBar = styled.div`
  background-color: ${colors.accent.CIVIL_RED_FADED};
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 500;
  height: 16px;
  padding: 8px 0;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
`;

export const NavErrorBar: React.FunctionComponent = props => {
  return <ErrorBar>Please Switch To Rinkeby Testnet</ErrorBar>;
};
