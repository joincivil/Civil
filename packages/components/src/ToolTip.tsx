import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";

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
  width: 260px;
  color: ${colors.basic.WHITE};
  background: rgba(21, 21, 21, 0.9);
  border-radius: 3px;
  padding: 15px;
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  line-height: 15px;
  z-index: 100001;
  &:after {
    content: "";
    position: absolute;
    left: calc(50% - 3px);
    top: 100%;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(21, 21, 21, 0.9);
  }
`;
// z-index to compete with wp

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const HitBox = styled.div`
  position: absolute;
  width: 260px;
  height: 50px;
  bottom: 0;
  left: -130px;
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
    return box.left - 5 + box.width / 2;
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
