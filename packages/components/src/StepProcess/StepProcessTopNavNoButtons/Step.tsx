import * as React from "react";
import styled from "styled-components";
import { colors } from "../../styleConstants";
import { StyledLiProps, StepState } from "../StepProcessTopNav";

export interface StepTopNavNoButtonsProps {
  title: string | JSX.Element;
  isActive?: boolean;
  isCurrent?: boolean;
  startPosition?: number;
  complete?: boolean;
  disabled?: boolean;
  index?: number;
  children: React.ReactChild;
  onClick?(index: number): void;
  setStartPosition?(position: number): void;
}

const StyledLi = styled<StyledLiProps, "li">("li")`
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  box-sizing: border-box;
  font-family: ${props => props.theme.sansSerifFont};
  font-weight: 500;
  margin-bottom: 0;
  padding: 3px 0 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: ${props => {
    if (props.isCurrent) {
      return colors.primary.CIVIL_BLUE_1;
    } else if (props.isActive) {
      return colors.primary.BLACK;
    } else {
      return colors.accent.CIVIL_GRAY_3;
    }
  }};
`;

export class StepNoButtons extends React.Component<StepTopNavNoButtonsProps, StepState> {
  public render(): JSX.Element {
    return (
      <StyledLi
        onClick={() => !this.props.disabled && this.props.onClick!(this.props.index!)}
        isActive={this.props.isActive}
        isCurrent={this.props.isCurrent}
        disabled={this.props.disabled}
      >
        {this.props.title}
      </StyledLi>
    );
  }
}
