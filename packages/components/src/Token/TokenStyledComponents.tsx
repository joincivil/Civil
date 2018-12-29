import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledTokenHeaderOuter = styled.div`
  background-color: ${colors.accent.CIVIL_TEAL_FADED};
  padding: 62px 0 38px;
`;

export const StyledTokenHeader = styled.div`
  color: ${colors.basic.WHITE};
  font-famliy: ${fonts.SERIF};
  width: 1200px;
`;
