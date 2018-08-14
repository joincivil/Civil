import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const HeroLabel = styled.span`
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.27px;
  margin-bottom: 30px;
`;

export const HeroHeading = styled.h2`
  font-family: ${fonts.SERIF};
  font-size: 38px;
  font-weight: 200;
  letter-spacing: -1px;
  line-height: 40px;
  margin: 0 auto 20px;
`;

export const HeroBlockTextLink = styled.a`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  font-size: 20px;
  margin-bottom: 40px;
  padding-bottom: 5px;
  text-decoration: none;
  transition: border-bottom 500ms;
  &:hover {
    border-bottom: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
`;

export const HeroSmallText = styled.span`
  display: block;
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 17px;
  margin-top: 15px;
`;
