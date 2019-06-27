import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { mediaQueries } from "@joincivil/components";

export const StyledPageContent = styled.div`
  margin: 0 auto;
  max-width: 1200px;
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
