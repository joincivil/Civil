import * as React from "react";
import styled from "styled-components";
import { InvertedButton, OBSectionDescription, mediaQueries } from "../";

export const BrowserCompatWrapper = styled.div`
  padding: 80px 0;
  text-align: center;

  ${mediaQueries.MOBILE} {
    padding: 30px 0;
  }
`;

export const BrowserLogo = styled.img`
  height: 24px;
  margin-right: 15px;
  vertical-align: bottom;
  width: 24px;
`;

export const BrowserButtons = styled.div`
  margin: 32px 0 70px;
`;

export const BrowserButton = styled(InvertedButton)`
  border-width: 1px;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 16px;
  min-width: 210px;
  padding: 5px 16px 7px;
  text-transform: none;

  &:first-child {
    margin-right: 16px;
  }

  ${mediaQueries.MOBILE} {
    &:first-child {
      margin-right: 0;
    }
  }
`;

export const BrowserCompatLinks = styled.a`
  &:first-child {
    margin-right: 48px;
  }
`;

export const BrowserCompatIntroStyled = styled(OBSectionDescription)`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`;
