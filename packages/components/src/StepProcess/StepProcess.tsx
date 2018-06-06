import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";

export interface StepProcessState {
  el?: HTMLDivElement | null;
}

export interface StepProcessProps {
  stepIsDisabled?(index: number): boolean;
}

export interface StepProps {
  el?: HTMLDivElement;
  index?: number;
  active?: number;
  disabled?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const StepIndicators = styled.div`
  width: 30%;
  max-width: 250px;
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-right: 35px;
`;

export class StepProcess extends React.Component<StepProcessProps, StepProcessState> {
  public el: HTMLDivElement | null = null;
  constructor(props: {}) {
    super(props);
    this.state = {
      el: null,
    };
  }
  public componentDidMount(): void {
    this.setState({ el: this.el });
  }
  public render(): JSX.Element {
    const childrenWithEl = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child as JSX.Element, {
        el: this.state.el,
        index,
        disabled: this.props.stepIsDisabled ? this.props.stepIsDisabled(index) : false,
      });
    });
    return (
      <Container>
        <StepIndicators>
          <div ref={el => (this.el = el)} />
        </StepIndicators>
        <div>{childrenWithEl}</div>
      </Container>
    );
  }
}
