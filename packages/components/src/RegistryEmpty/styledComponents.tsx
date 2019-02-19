import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";
import { Button } from "../Button";

export const StyledRegistryEmpty = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 50px 0 221px;
  text-align: center;
`;

export const StyledEmptyHeader = styled.div`
  font-size: 21px;
  line-height: 33px;
  letter-spacing: -0.2px;
  margin: 0 0 60px;
`;

export const StyledEmptyCopy = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  line-height: 33px;
  letter-spacing: -0.12px;
  margin: 40px 0;

  ${Button} {
    margin-top: 12px;
  }
`;
