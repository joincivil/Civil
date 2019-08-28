import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";
import { InvertedButton } from "../Button";

export const CopyBtn = styled(InvertedButton)`
  background-color: transparent;
  border: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 0;
  text-transform: none;

  &:hover,
  &:focus {
    background-color: transparent;
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: underline;
  }
`;

export const CopyURLSuccess = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: bold;
  line-height: 24px;
  text-align: center;

  svg {
    vertical-align: sub;
  }
`;
