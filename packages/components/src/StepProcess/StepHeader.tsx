import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { StyledComponentClass } from "styled-components";
import { fonts, colors } from "../styleConstants";

export interface ComponentProps {
  disabled?: boolean;
  active?: boolean;
}

export const SectionHeader = styled<ComponentProps, "h4">("h4")`
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: ${props => props.active ? props.theme.stepHeaderWeightHeavy : props.theme.stepHeaderWeightLight};
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : "#000")};
`;

SectionHeader.defaultProps = {
  theme: {
    sansSerifFont: fonts.SANS_SERIF,
    stepHeaderWeightHeavy: 600,
    stepHeaderWeightLight: 400,
  },
};

export interface StepHeaderTheme {
  stepHeaderWeight: number;
  stepHeaderWeightHeavy: number,
}

export interface StepHeaderProps {
  children: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
  active?: boolean;
}

export const StepHeader = (props: StepHeaderProps): JSX.Element => {
  return <SectionHeader {...props}>{props.children}</SectionHeader>;
};
