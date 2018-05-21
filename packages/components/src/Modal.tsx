import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

const ModalOuter = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled.div`
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.6);
  max-width: 460px;
  padding: 35px;
  background: #fff;
`;

export class Modal extends React.Component {
  public bucket: HTMLDivElement = document.createElement("div");

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(
      <ModalOuter>
        <ModalInner>{this.props.children}</ModalInner>
      </ModalOuter>,
      this.bucket,
    );
  }
}
