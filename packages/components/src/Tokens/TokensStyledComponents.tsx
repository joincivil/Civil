import * as React from "react";
import styled from "styled-components";
import { colors, fonts } from "../styleConstants";

export const TokenAccountOuter = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

export const TokenAccountInner = styled.div`
  width: 1200px;
`;

export const StyledTokenHeaderOuter = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 30px;
  width: 100%;
`;

export const StyledTokenHeader = styled.h2`
  color: ${colors.primary.BLACK};
  font-size: 27px;
  line-height: 39px;
  margin-bottom: 35px;
`;

export const StyledTokenSetupText = styled.p`
  color: ${colors.primary.BLACK};
  font-size: 24px;
  line-height: 29px;
  margin-bottom: 60px;
`;

export const StyledTokenHelpText = styled.p`
  color: ${colors.primary.BLACK};
  font-size: 16px;
  line-height: 26px;
  margin-bottom: 15px;
`;

export const StyledTokenSideModule = styled.div`
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  padding: 20px 30px;
  width: 290px;
`;

export const StyledSideModuleHeader = styled.h3`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 18px;
  line-height: 28px;
  margin: 0 0 25px;
`;

export const StyledSideModuleText = styled.p`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 26px;

  a {
    color: ${colors.accent.CIVIL_BLUE};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
