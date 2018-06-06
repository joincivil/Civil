import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "./styleConstants";

export interface OpenBool {
  open: boolean;
}

export interface ArrowProps extends OpenBool {
  disabled?: boolean;
}

export interface CollapsableProps extends OpenBool {
  header: React.ReactNode;
  disabled?: boolean;
}

export interface CollapseAreaProps extends OpenBool {
  height: number | null;
}

export const CollapseArea: StyledComponentClass<CollapseAreaProps, "div"> = styled<CollapseAreaProps, "div">("div")`
  height: ${props => (props.open ? `${props.height ? `${props.height}px` : "auto"}` : "0px")};
  transition: height 1s;
  overflow: hidden;
`;

export const Arrow: StyledComponentClass<ArrowProps, "div"> = styled<ArrowProps, "div">("div")`
  width: 8px;
  height: 8px;
  border-left: 3px solid ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.CIVIL_GRAY_1)};
  border-bottom: 3px solid ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.CIVIL_GRAY_1)};
  transform: ${props => (props.open ? "rotate(135deg)" : "rotate(-45deg)")};
  transition: transform 1s;
  position: absolute;
  right: 0;
  top: 10px;
`;

export const HeaderWrapper = styled.div`
  position: relative;
`;

export class Collapsable extends React.Component<CollapsableProps, CollapseAreaProps> {
  public collapseArea: HTMLDivElement | null;

  constructor(props: CollapsableProps) {
    super(props);
    this.state = {
      open: props.open,
      height: null,
    };
    this.collapseArea = null;
  }

  public componentDidMount(): void {
    this.collapseArea!.addEventListener("transitionend", () => {
      if (this.state.open) {
        this.setState({ height: null });
      }
    });
  }

  public componentWillReceiveProps(nextProps: CollapsableProps): void {
    if (nextProps.open !== this.props.open) {
      this.setState({ open: nextProps.open });
    }
  }
  public render(): JSX.Element {
    return (
      <div>
        <HeaderWrapper onClick={this.open}>
          {this.props.header} <Arrow disabled={this.props.disabled} open={this.state.open} />
        </HeaderWrapper>
        <CollapseArea innerRef={el => (this.collapseArea = el)} height={this.state.height} open={this.state.open}>
          {this.props.children}
        </CollapseArea>
      </div>
    );
  }
  private open = (): void => {
    if (!this.props.disabled) {
      if (this.state.open) {
        this.setState({ height: this.collapseArea!.clientHeight });
      }
      setImmediate(() => {
        this.setState({ open: !this.state.open });
      });
    }
  };
}
