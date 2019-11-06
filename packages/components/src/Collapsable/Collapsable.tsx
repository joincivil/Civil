import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

export interface OpenBool {
  open: boolean;
}

export interface ArrowProps extends OpenBool {
  disabled?: boolean;
}

export interface CollapsableProps extends OpenBool {
  headerWrapper?: any;
  header?: React.ReactNode;
  headerComponent?: any;
  headerOpen?: React.ReactNode;
  ArrowComponent?: any;
  disabled?: boolean;
  className?: string; // for use as styled component
  count?: number;
}

export interface CollapseAreaProps extends OpenBool {
  height: number | null;
}

export const CollapseArea = styled.div<CollapseAreaProps>`
  height: ${props => (props.open ? `${props.height ? `${props.height}px` : "auto"}` : "0px")};
  transition: height 1s;
  overflow: ${props => (props.open ? "visible" : "hidden")};
`;

export const Arrow = styled.div<ArrowProps>`
  width: 8px;
  height: 8px;
  border-left: 3px solid ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.CIVIL_GRAY_1)};
  border-bottom: 3px solid ${props => (props.disabled ? colors.accent.CIVIL_GRAY_3 : colors.primary.CIVIL_GRAY_1)};
  transform: ${props => (props.open ? "rotate(135deg)" : "rotate(-45deg)")};
  transition: transform 1s;
  position: absolute;
  right: 10px;
  top: 10px;
`;

export const DefaultHeaderWrapper = styled.div`
  position: relative;
  cursor: pointer;
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
    if (this.collapseArea) {
      this.collapseArea!.addEventListener("transitionend", () => {
        if (this.state.open) {
          this.setState({ height: null });
        }
      });
    }
  }

  public componentWillReceiveProps(nextProps: CollapsableProps): void {
    if (nextProps.open !== this.props.open) {
      this.setState({ open: nextProps.open });
    }
  }
  public render(): JSX.Element {
    let header = this.props.header;
    if (this.state.open && this.props.headerOpen) {
      header = this.props.headerOpen;
    }
    const HeaderComponent = this.props.headerComponent;
    const HeaderWrapper = this.props.headerWrapper || DefaultHeaderWrapper;
    return (
      <div className={this.props.className}>
        <HeaderWrapper onClick={this.open} isOpen={this.state.open}>
          {HeaderComponent && <HeaderComponent isOpen={this.state.open} count={this.props.count} />}
          {header && <>{header} </>}
          {this.props.ArrowComponent ? (
            <this.props.ArrowComponent disabled={this.props.disabled} open={this.state.open} />
          ) : (
            <Arrow disabled={this.props.disabled} open={this.state.open} />
          )}
        </HeaderWrapper>
        <CollapseArea ref={(el: any) => (this.collapseArea = el)} height={this.state.height} open={this.state.open}>
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
