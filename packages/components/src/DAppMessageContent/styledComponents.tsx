import * as React from "react";
import { InvertedButton } from "../Button";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";

export const StyledMessageIconContainer = styled.span`
  display: inline-block;
  margin-right: 25px;
`;

export const StyledBuyCVLButtonContainer = styled.div`
  margin-left: 40px;

  & ${InvertedButton} {
    white-space: nowrap;
  }
`;

export const StyledErrorMessage = styled.span`
  color: ${colors.accent.CIVIL_RED};
  font-size: 16px;
  letter-spacing: -0.11px;
  line-height: 24px;
`;

export const StyledMessageWithIconContainer = styled.div`
  display: flex;
  align-items: center;

  & ${StyledMessageIconContainer}, & ${StyledErrorMessage} {
    display: block;
  }
`;
