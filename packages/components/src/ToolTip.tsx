import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { colors } from "./styleConstants";

export interface ToolTipProps {
  explainerText: React.ReactNode;
  disabled?: boolean;
}

export interface ToolTipState {
  open: boolean;
}

export interface TipProps {
  top: number;
  left: number;
}

const TipContainer = styled<TipProps, "div">("div")`
  position: absolute;
  top: ${(props: TipProps) => props.top}px;
  left: ${(props: TipProps) => props.left}px;
  height: 0px;
`;

const Tip = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  margin-left: -90px;
  width: 180px;
  color: ${colors.basic.WHITE};
  background: rgba(21, 21, 21, 0.9);
  text-align: center;
  border-radius: 3px;
  padding: 13px;
  font-size: 12px;
  &:after {
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    top: 100%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 10px solid rgba(21, 21, 21, 0.9);
  }
`;

const Wrapper = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
  display: inline-block;
  margin-left: 5px;
  margin-top: -1px;
`;

const HitBox = styled.div`
  position: absolute;
  width: 180px;
  height: 50px;
  bottom: 0;
  left: -81px;
  border-radius: 50%;
  background-color: transparent;
`;

export class ToolTip extends React.Component<ToolTipProps, ToolTipState> {
  public divEl: HTMLDivElement | null;
  public bucket: HTMLDivElement = document.createElement("div");

  constructor(props: ToolTipProps) {
    super(props);
    this.divEl = null;
    this.state = {
      open: false,
    };
  }

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    this.bucket.remove();
  }

  public render(): JSX.Element {
    let tip = null;
    let hitBox = null;
    if (this.state.open) {
      tip = ReactDOM.createPortal(
        <TipContainer left={this.getLeft()} top={this.getTop()}>
          <Tip>{this.props.explainerText}</Tip>
        </TipContainer>,
        this.bucket,
      );
      hitBox = <HitBox />;
    }

    return (
      <Wrapper
        innerRef={(el: HTMLDivElement) => (this.divEl = el)}
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
      >
        {tip}
        {hitBox}
        {this.props.children}
      </Wrapper>
    );
  }

  private getLeft = (): number => {
    const box = this.divEl!.getBoundingClientRect();
    return box.left - box.width / 4;
  };

  private getTop = (): number => {
    const box = this.divEl!.getBoundingClientRect();
    const scrollDist = (document.documentElement || document.body.parentNode || document.body).scrollTop;
    return scrollDist + box.top;
  };

  private onMouseEnter = (): void => {
    this.setState({ open: true });
  };

  private onMouseLeave = (): void => {
    this.setState({ open: false });
  };
}
