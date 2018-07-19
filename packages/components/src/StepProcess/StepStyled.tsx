import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export interface StepStyledProps {
  index: number;
  disabled?: boolean;
}

export interface StepDescriptionProps {
  disabled?: boolean;
}

export const StepStyled = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 23px 4px 37px 50px;
  width: 645px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  &:after{
    content: "${(props: StepStyledProps) => props.index + 1}";
    color: ${(props: StepStyledProps) => (props.disabled ? colors.accent.CIVIL_GRAY_3 : "#000")};
    position: absolute;
    left: 3px;
    top: 20px;
    height: 10px;
    font-family: ${fonts.SANS_SERIF};
    font-size: 25px;
    font-weight: 400;
  }
`;

export const StepStyledFluid = StepStyled.extend`
  padding-left: 0;
  padding-right: 0;
  width: 100%;

  // Step counter marker is position "outside" for Fluid sections
  &:after {
    background: ${colors.accent.CIVIL_GRAY_4};
    border-radius: 50%;
    box-sizing: border-box;
    left: -52px;
    height: 34px;
    padding-top: 8px;
    text-align: center;
    width: 34px;
  }
`;

export const StepDescription = styled<StepDescriptionProps, "p">("p")`
  color: ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.accent.CIVIL_GRAY_2)};
  margin-bottom: 23px;
  margin-top: 0;
`;
