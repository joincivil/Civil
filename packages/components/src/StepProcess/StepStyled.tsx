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
  padding: 23px 4px 37px 75px;
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
    top: 23px;
    height: 10px;
    font-family: ${props => props.theme.sansSerifFont};
    font-size: 20px;
    font-weight: 600;
  }
`;

StepStyled.defaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
  },
}

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
