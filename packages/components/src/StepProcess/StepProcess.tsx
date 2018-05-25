import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";

export interface StepProcessState {
  el?: HTMLDivElement | null;
  active: number;
}

export interface StepProps {
  el?: HTMLDivElement;
  index?: number;
  active?: number;
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

export class StepProcess extends React.Component<{}, StepProcessState> {
  public el: HTMLDivElement | null = null;
  constructor(props: {}) {
    super(props);
    this.state = {
      el: null,
      active: 0,
    };
  }
  public componentDidMount(): void {
    this.setState({el: this.el});
  }
  public render(): JSX.Element {
    const childrenWithEl = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child as JSX.Element, {el: this.state.el, index, active: this.state.active });
    })
    return (<Container>
      <StepIndicators><div ref={el => this.el = el}></div></StepIndicators>
      <div>{childrenWithEl}</div>
    </Container>);
  }
};
