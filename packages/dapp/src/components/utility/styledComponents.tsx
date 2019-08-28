import * as React from "react";
import styled from "styled-components";
import { mediaQueries } from "@joincivil/components";

export interface StyledPageContentProps {
  centerContent?: boolean;
}

export const StyledPageContent = styled.div<StyledPageContentProps>`
  ${props =>
    !props.centerContent
      ? ""
      : `
    display: flex;
    justify-content: center;
  `} margin: 0 auto;
  max-width: 1200px;
`;

export const StyledPageContentWithPadding = styled(StyledPageContent)`
  padding-top: 50px;
`;

export const StyledListingCopy = styled.div`
  font-size: 18px;
  letter-spacing: -0.17px;
  line-height: 33px;
  padding: 0 200px 50px;
  text-align: center;

  ${mediaQueries.MOBILE} {
    padding: 0 16px 31px;
  }
`;

export const StyledInPageMsgContainer = styled.div`
  padding-top: 100px;
  text-align: center;
`;
