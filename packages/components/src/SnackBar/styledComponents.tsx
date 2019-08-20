import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledSnackBar = styled.div`
  justify-content: center;
  display: flex;
  background: ${colors.basic.WHITE};
  box-shadow: 0 2px 10px 0 ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  padding: 30px 0;
  position: fixed;
  top: 62px;
  width: 100%;
  z-index: 99;
`;

export const StyledSnackBarContent = styled.div`
  width: 708px;
`;
