import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export const ModalHeading = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 400;
  font-size: 24px;
`;

export const ModalContent = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.primary.CIVIL_GRAY_2};
  font-weight: 200;
  font-size: 12px;
  line-height: 24px;
`;
