import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { mediaQueries } from "../styleConstants";

export const StyledMainContainer = styled.div`
  margin-top: 62px;

  ${mediaQueries.MOBILE} {
    margin-top: 52px;
  }
`;
