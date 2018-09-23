import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";

export interface ToolTipProps {
  explainerText: React.ReactNode;
  disabled?: boolean;
  positionBottom?: boolean;
}

export interface ToolTipState {
  open: boolean;
}

export interface TipProps {
  positionBottom?: boolean;
}

const TipContainer = styled.div`
  position: absolute;
  top: 0;
  left: -133px;
  height: 0;
`;

const Tip = styled.div`
  position: absolute;
  ${(props: TipProps) => (props.positionBottom ? "top: 30px" : "bottom: 10px")};
  left: 0;
  width: 260px;
  color: ${colors.basic.WHITE};
  background: rgba(21, 21, 21, 0.9);
  border-radius: 3px;
  padding: 15px;
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  text-transform: none;
  z-index: 100001;
  &:after {
    content: "";
    position: absolute;
    left: calc(50% - 3px);
    top: ${(props: TipProps) => (props.positionBottom ? "-6px" : "100%")};
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(21, 21, 21, 0.9);
    transform: ${(props: TipProps) => (props.positionBottom ? "rotate(180deg)" : "rotate(0)")};
  }
`;
// z-index to compete with wp

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: top;
`;

const HitBox = styled.div`
  background-color: transparent;
  position: absolute;
  width: 260px;
  height: 50px;
  bottom: -15px;
  left: -130px;
  z-index: 100001;
`;

export class ToolTip extends React.Component<ToolTipProps, ToolTipState> {
  constructor(props: ToolTipProps) {
    super(props);
    this.state = {
      open: false,
    };
  }

  public render(): JSX.Element {
    let tip = null;
    let hitBox = null;
    if (this.state.open) {
      tip = (
        <TipContainer>
          <Tip positionBottom={this.props.positionBottom}>{this.props.explainerText}</Tip>
        </TipContainer>
      );
      hitBox = <HitBox />;
    }

    return (
      <Wrapper onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter}>
        {tip}
        {hitBox}
        {this.props.children}
      </Wrapper>
    );
  }

  private onMouseEnter = (): void => {
    this.setState({ open: true });
  };

  private onMouseLeave = (): void => {
    this.setState({ open: false });
  };
}
