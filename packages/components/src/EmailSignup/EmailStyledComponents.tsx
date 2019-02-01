import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "../styleConstants";

export const StyledEmailSignupTitle = styled.div`
  color: ${colors.primary.BLACK};
  font-size: 24px;
  font-weight: 900;
  line-height: 29px;
  margin: 0 0 6px;
`;

export const StyledEmailSignupCopy = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 14px;
  letter-spacing: -0.09px;
  line-height: 20px;
`;

export const StyledEmailSignupContainer = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  box-shadow: inset 0 5px 0 0 ${colors.primary.BLACK};
  padding: 38px 39px 24px;
`;

export const StyledEmailSignupSuccessContainer = styled(StyledEmailSignupContainer)`
  padding-top: 92px;
  text-align: center;

  & > ${StyledEmailSignupCopy}:first-of-type {
    font-size: 18px;
    letter-spacing: normal;
    line-height: 33px;
    margin: 0 0 133px;
  }
`;
