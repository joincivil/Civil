import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export const ModalHeader = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 400;
  color: ${colors.primary.BLACK};
`;
