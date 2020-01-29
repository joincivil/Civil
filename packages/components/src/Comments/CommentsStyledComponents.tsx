import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "@joincivil/elements";

export const CommentsCountStyled = styled.div`
  align-items: center;
  color: ${colors.accent.CIVIL_GRAY_1};
  display: flex;
  font-family: ${fonts.SANS_SERIF};
  font-size: 11px;
  font-weight: 600;
  line-height: 13px;
`;

export const CommentsLabel = styled.span`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;

  svg {
    opacity: 0.3;
  }
`;
