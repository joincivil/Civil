import * as React from "react";
import { InvertedButton } from "../Button";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";
import { MetaMaskSideIcon, MetaMaskIconProps } from "../icons";

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

export const MetaMaskMockImage = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 255px;
`;

export const MetaMaskIcon = styled<MetaMaskIconProps>(MetaMaskSideIcon)`
  position: relative;
  top: 3px;
`;

export const StyledLargeModalText = styled.p`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 18px;
  line-height: 24px;
`;

export const StyledSmallModalText = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
  line-height: 20px;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;
  }
`;
