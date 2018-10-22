import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const StyledRegistryEmpty = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 50px 0 221px;
  text-align: center;
`;

export const StyledEmptyHeader = styled.div`
  font-size: 21px;
  line-height: 33px;
  letter-spacing: -0.2px;
  margin: 0 0 7px;
`;

export const StyledEmptyCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 33px;
  letter-spacing: -0.2px;
  margin: 7px 0 40px;
`;
