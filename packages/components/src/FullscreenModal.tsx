import * as React from "react";
import * as ReactDom from "react-dom";
import styled from "styled-components";
import { colors, fonts, mediaQueries } from "@joincivil/elements";

export interface ModalWrapperProps {
  solidBackground?: boolean;
}

export const ModalWrapper = styled.div`
  align-items: ${(props: ModalWrapperProps) => (props.solidBackground ? "flex-start" : "center")};
  background-color: ${(props: ModalWrapperProps) =>
    props.solidBackground ? colors.basic.WHITE : "rgba(0, 0, 0, 0.4)"};
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  padding: ${(props: ModalWrapperProps) => (props.solidBackground ? "90px 0" : "0")};
  position: fixed;
  overflow: auto;
  right: 0;
  top: 0;
  z-index: ${(props: ModalWrapperProps) => (props.solidBackground ? "9999999" : "2")};

  ${mediaQueries.MOBILE_SMALL} {
    display: block;
  }
`;

export const ModalInner = styled.div`
  align-items: ${(props: ModalWrapperProps) => (props.solidBackground ? "flex-start" : "center")};
  background-color: ${colors.basic.WHITE};
  border: ${(props: ModalWrapperProps) => (props.solidBackground ? "none" : "1px solid " + colors.accent.CIVIL_GRAY_4)};
  display: flex;
  flex-direction: column;
  font-family: ${fonts.SANS_SERIF};
  justify-content: space-around;
  margin: auto;
  min-width: 250px;
  ${(props: ModalWrapperProps) => (props.solidBackground ? "width: 100%" : "")};

  ${mediaQueries.MOBILE_SMALL} {
    bottom: 0;
    left: 0;
    overflow: auto;
    position: fixed;
    top: 54px;
    width: 100%;
  }
`;

export interface FullScreenModalProps {
  solidBackground?: boolean;
  open: boolean;
  dismissOnOutsideClick?: boolean;
  className?: string;
  handleClose?(): void;
}

export class FullScreenModal extends React.Component<FullScreenModalProps> {
  public el: HTMLDivElement | undefined;

  constructor(props: FullScreenModalProps) {
    super(props);
    this.state = {};
    if (typeof document !== "undefined") {
      this.el = document.createElement("div");
    }

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  public componentDidMount(): void {
    if (this.el) {
      document.body.appendChild(this.el);
      if (this.props.dismissOnOutsideClick) {
        document.addEventListener("mousedown", ev => this.handleClickOutside(ev));
      }
    }
  }
  public componentWillUnmount(): void {
    if (this.el) {
      document.body.removeChild(this.el);
      document.removeEventListener("mousedown", ev => this.handleClickOutside(ev));
    }
  }

  public render(): React.ReactPortal | JSX.Element | null {
    if (!this.props.open || this.el === undefined) {
      return null;
    }

    return ReactDom.createPortal(
      <ModalWrapper className={this.props.className} solidBackground={this.props.solidBackground}>
        <ModalInner solidBackground={this.props.solidBackground}>{this.props.children}</ModalInner>
      </ModalWrapper>,
      this.el,
    );
  }

  private handleClickOutside(event: any): void {
    if (
      this.el &&
      this.el.children[0] &&
      this.el.children[0].children[0] &&
      !this.el.children[0].children[0].contains(event.target)
    ) {
      this.close();
    }
  }

  private close(): void {
    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }
}
