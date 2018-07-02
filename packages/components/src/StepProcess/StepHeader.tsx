import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { StyledComponentClass } from "styled-components";
import { fonts, colors } from "../styleConstants";
import { Done } from "@material-ui/icons";

export interface ComponentProps {
  disabled?: boolean;
}

const SectionHeader = styled<ComponentProps, "h4">("h4")`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 600;
  margin-top: 20px;
  color: ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : "#000")};
`;

export interface StepHeaderProps {
  children: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
}

export const StepHeader = (props: StepHeaderProps): JSX.Element => {
  return (<SectionHeader disabled={props.disabled}>{props.children}</SectionHeader>);
};
