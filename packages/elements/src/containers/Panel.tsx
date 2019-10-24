import * as React from "react";
import * as ReactDom from "react-dom";
import styled from "styled-components";
import { colors } from "../colors";
import { CloseXButton } from "../buttons";
import { mediaQueries } from "./";

export const PanelWrapper = styled.div`
  background-color: ${colors.basic.WHITE};
  border-left: 1px solid ${colors.accent.CIVIL_GRAY_4};
  bottom: 0;
  padding: 20px;
  position: fixed;
  overflow: auto;
  right: 0;
  top: 74px;
  transform: translateX(100%);
  transition: transform 2s;
  transition-delay: 2s;
  width: 350px;
  z-index: 3;

  &.open {
    transform: none;
  }

  ${mediaQueries.MOBILE} {
    top: 74px;
    width: 100%;
  }
`;

export const PanelClose = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
`

export interface PanelProps {
  open: boolean;
  handleClose?(): void;
}

export class Panel extends React.Component<PanelProps> {
  public el: HTMLDivElement | undefined;

  constructor(props: PanelProps) {
    super(props);
    this.state = {};
    if (typeof document !== "undefined") {
      this.el = document.createElement("div");
    }
  }
  public componentDidMount(): void {
    if (this.el) {
      document.body.appendChild(this.el);
    }
  }
  public componentWillUnmount(): void {
    if (this.el) {
      document.body.removeChild(this.el);
    }
  }

  public render(): React.ReactPortal | JSX.Element | null {
    if (!this.props.open || this.el === undefined) {
      return null;
    }
    const panelStatus = this.props.open ? "open" : "";

    return ReactDom.createPortal(
      <PanelWrapper className={panelStatus}>
        {this.props.handleClose &&
          <PanelClose>
            <CloseXButton onClick={this.props.handleClose} />
          </PanelClose>
        }
        {this.props.children}
      </PanelWrapper>,
      this.el,
    );
  }
}
