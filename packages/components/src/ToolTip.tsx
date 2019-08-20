import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { colors, fonts } from "./styleConstants";

export interface ToolTipTheme {
  toolTipDefaultWidth?: number;
  toolTipTextAlign?: string;
  toolTipColorEnabled?: string;
  toolTipColorDisabled?: string;
}

export interface ToolTipProps {
  explainerText: React.ReactNode;
  disabled?: boolean;
  positionBottom?: boolean;
  verticalOffset?: number;
  className?: string; // for use as styled component
  width?: number;
  theme?: ToolTipTheme;
  onClick?(e: React.MouseEvent): void;
}

export interface ToolTipState {
  open: boolean;
}

export interface TipContainerProps {
  top?: number;
  left?: number;
}

const TipContainer = styled<TipContainerProps, "div">("div")`
  position: absolute;
  top: ${(props: TipContainerProps) => props.top || 0}px;
  left: ${(props: TipContainerProps) => props.left || 0}px;
  height: 0px;
`;

const Tip = styled<ToolTipProps, "div">("div")`
  position: absolute;
  ${(props: ToolTipProps) => (props.positionBottom ? "top: 30px" : "bottom: 10px")};
  left: 7px;
  ${(props: ToolTipProps) =>
    props.verticalOffset ? `margin-${props.positionBottom ? "top" : "bottom"}: ${props.verticalOffset}px` : ""};
  transform: translateX(-50%);
  width: ${(props: ToolTipProps) => props.width || (props.theme && props.theme.toolTipDefaultWidth) || 260}px;
  color: ${colors.basic.WHITE};
  background: rgba(21, 21, 21, 0.9);
  border-radius: 3px;
  padding: 15px;
  ${(props: ToolTipProps) =>
    props.theme && props.theme.toolTipTextAlign ? `text-align: ${props.theme.toolTipTextAlign}` : ""};
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  text-transform: none;
  z-index: 100001;
  &:after {
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    top: ${(props: ToolTipProps) => (props.positionBottom ? "-6px" : "100%")};
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(21, 21, 21, 0.9);
    transform: ${(props: ToolTipProps) => (props.positionBottom ? "rotate(180deg)" : "rotate(0)")};
  }
`;
// z-index to compete with wp

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const HitBox = styled.div`
  background-color: transparent;
  position: absolute;
  width: 100%;
  height: 100%;
  min-width: 30px;
  min-height: 30px;
  top: 0;
  left: 0;
  z-index: 100001;
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
          <Tip {...this.props}>{this.props.explainerText}</Tip>
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
        onClick={this.props.onClick}
        className={this.props.className}
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
