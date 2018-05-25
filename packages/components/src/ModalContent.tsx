import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export const ModalContent = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.primary.CIVIL_GRAY_2};
  font-weight: 200;
  font-size: 12px;
  line-height: 24px;
`;
