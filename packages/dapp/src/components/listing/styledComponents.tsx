import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Heading, mediaQueries } from "@joincivil/components";

export const RightShark = styled.div`
  margin: -100px 0 0 15px;
`;

export const ListingTabHeading = Heading.withComponent("h3").extend`
  font-size: 32px;
  line-height: 34px;
  margin: 34px 0 10px;
`;

export const ListingTabContent = styled.div`
  font-size: 18px;
  line-height: 33px;
  padding: 40px 0 0;
  width: 635px;

  ${mediaQueries.MOBILE} {
    padding: 40px 0;
    width: auto;
  }

  & p {
    font-size: inherit;
    line-height: inherit;
  }
`;
