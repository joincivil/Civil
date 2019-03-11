import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts, mediaQueries } from "../styleConstants";

export const StyledFooter = styled.footer`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  font-family: ${fonts.SANS_SERIF};
  margin: 50px auto 0;
  max-width: 1440px;
  padding: 50px 30px;

  ${mediaQueries.MOBILE} {
    padding: 40px 15px;
  }
`;

export const StyledFooterInner = styled.div`
  display: flex;
  justify-content: space-between;

  ${mediaQueries.MOBILE} {
    display: block;
  }
`;

export const StyledFooterInnerLeft = styled.div`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
    margin: 0 0 30px;
  }
`;

export const StyledFooterInnerRight = styled.div`
  font-size: 12px;
  padding: 9px 0 0;
  text-align: right;

  ${mediaQueries.MOBILE} {
    padding: 9px 0 0;
    text-align: left;
  }
`;

export const StyledFooterLogo = styled.div`
  margin-right: 50px;
  width: 74px;
`;

export const StyledFooterNav = styled.nav`
  display: flex;

  ${mediaQueries.MOBILE} {
    display: block;
  }

  ul {
    margin: 0 20px;
    padding: 2px 0 0;
    width: 120px;

    ${mediaQueries.MOBILE} {
      margin: 0 0 15px;
      padding: 0;
      width: 100%;
    }
  }

  li {
    color: ${colors.accent.CIVIL_GRAY_0};
    font-size: 16px;
    line-height: 26px;
    list-style: none;
    margin: 0;
    text-align: left;
  }

  b {
    color: ${colors.primary.BLACK};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    line-height: 26px;
    text-transform: uppercase;
  }

  a {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 12px;
    font-weight: 500;
    line-height: 28px;
    text-decoration: none;
    text-transform: uppercase;
    -webkit-transition: color 0.2s;
    transition: color 0.2s;
  }

  a:hover {
    color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const StyledSlogan = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  margin: 0 auto 10px;
  text-transform: uppercase;
`;

export const StyledFooterSocial = styled.div`
  margin: 0 0 69px;

  ${mediaQueries.MOBILE} {
    margin: 0 0 30px;
  }

  a {
    margin: 0 14px 0 0;
  }
`;

export const StyledFooterCopyright = styled.span`
  color: ${colors.accent.CIVIL_GRAY_2};
  display: block;
  font-size: 12px;
`;
