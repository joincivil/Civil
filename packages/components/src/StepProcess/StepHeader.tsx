import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { StyledComponentClass } from "styled-components";
import { fonts, colors } from "../styleConstants";

const SectionHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 600;
  margin-top: 20px;
`;

const SectionIndicator = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 400;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 15px 25px;
  position: relative;
  &:last-child{
    border-bottom: none;
  }
  &.active:after{
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: calc(100% - 3px);
    background-color: ${colors.accent.CIVIL_BLUE};
  }
`;

export interface StepHeaderProps {
  el: HTMLDivElement | void;
  children: React.ReactNode | React.ReactNode[];
  isActive: boolean;
}

export const StepHeader = (props: StepHeaderProps): JSX.Element => {
  return (<>
    <SectionHeader>{props.children}</SectionHeader>
    {props.el && ReactDOM.createPortal(<SectionIndicator className={props.isActive ? "active" : ""}>{props.children}</SectionIndicator>, props.el)}
  </>);
};
