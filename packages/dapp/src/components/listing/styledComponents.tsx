import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Heading } from "@joincivil/components";

export const GridRow = styled.div`
  display: flex;
  margin: 0 auto;
  padding: 0 0 200px;
  width: 1200px;
`;
export const LeftShark = styled.div`
  width: 695px;
`;
export const RightShark = styled.div`
  margin: -100px 0 0 15px;
  width: 485px;
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

  & p {
    font-size: inherit;
    line-height: inherit;
  }
`;
