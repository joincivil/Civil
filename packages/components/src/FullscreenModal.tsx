import * as React from "react";
import * as ReactDom from "react-dom";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "./styleConstants";

export const ModalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export const ModalInner = styled.div`
  min-width: 250px;
  background-color: ${colors.basic.WHITE};
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-family: "Libre Franklin", sans-serif;
`;

export interface FullScreenModalProps {
  open: boolean;
  dismissOnOutsideClick?: boolean;
  className?: string;
  handleClose(): void;
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
      <ModalWrapper>
        <ModalInner>{this.props.children}</ModalInner>
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
    this.props.handleClose();
  }
}
