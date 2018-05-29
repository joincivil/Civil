import * as React from "react";
import * as ReactDOM from "react-dom";
import styled, { StyledComponentClass } from "styled-components";
import { fonts, colors } from "../styleConstants";
import { Done } from "@material-ui/icons";

const SectionHeader = styled.h4`
  font-family: ${fonts.SANS_SERIF};
  font-weight: 600;
  margin-top: 20px;
`;

const StyledDone = styled(Done)`
  stroke: transparent;
  width: 10px;
  height: 10px;
  fill: #fff;
  color: #fff;
`;

const DoneWrapper = styled.span`
  border-radius: 50%;
  background-color: ${colors.accent.CIVIL_TEAL};
  width: 25px;
  height: 25px;
  display: inline-block;
`;

const SectionIndicator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-family: ${fonts.SANS_SERIF};
  font-weight: 400;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding: 15px 25px;
  position: relative;
  &:last-child {
    border-bottom: none;
  }
  &.active:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: calc(100% - 3px);
    background-color: ${colors.accent.CIVIL_BLUE};
  }
  &.completed:after {
    content: "";
    position: absolute;
    right: 
  }
`;

export interface StepHeaderProps {
  el: HTMLDivElement | void;
  children: React.ReactNode | React.ReactNode[];
  isActive: boolean;
  completed?: boolean;
}

export const StepHeader = (props: StepHeaderProps): JSX.Element => {
  const completed = props.completed ? <DoneWrapper><StyledDone/></DoneWrapper> : "";
  return (<>
    <SectionHeader>{props.children}</SectionHeader>
    {
      props.el &&
      ReactDOM.createPortal(<SectionIndicator
        className={props.isActive ? "active" : ""}
      >{props.children}{completed}</SectionIndicator>, props.el)
    }
  </>)
};
