import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

export interface StepProcessProps {
  disabled?: boolean;
  activeIndex?: number;
  stepIsDisabled?(index: number): boolean;
}

export interface StepProps {
  index?: number;
  active?: boolean;
  disabled?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export class StepProcess extends React.Component<StepProcessProps> {
  public render(): JSX.Element {
    const childrenWithDisabled = React.Children.map(this.props.children, (child, index) => {
      let disabled = this.props.stepIsDisabled ? this.props.stepIsDisabled(index) : false;
      if (this.props.disabled) {
        disabled = this.props.disabled;
      }
      return React.cloneElement(child as JSX.Element, {
        index,
        active: this.props.activeIndex === index,
        disabled,
      });
    });
    return <Container>{childrenWithDisabled}</Container>;
  }
}
