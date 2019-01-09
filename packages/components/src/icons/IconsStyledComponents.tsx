import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";

export const CircleBorder = styled.div`
  align-items: center;
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_BLUE};
  border-radius: 50%;
  display: flex;
  height: 38px;
  justify-content: center;
  width: 38px;
`;
