import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

const ModalOuter = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
<<<<<<< HEAD
  background-color: rgba(255, 255, 255, 0.7);
=======
  background-color: rgba(255,255,255,0.7);
>>>>>>> add modal to patterns
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled.div`
<<<<<<< HEAD
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.6);
=======
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, .6);
>>>>>>> add modal to patterns
  max-width: 460px;
  padding: 35px;
  background: #fff;
`;

<<<<<<< HEAD
=======

>>>>>>> add modal to patterns
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
<<<<<<< HEAD
      <ModalOuter>
        <ModalInner>{this.props.children}</ModalInner>
      </ModalOuter>,
      this.bucket,
    );
  }
}
=======
      <ModalOuter><ModalInner>{this.props.children}</ModalInner></ModalOuter>,
      this.bucket,
    );
  };
};
>>>>>>> add modal to patterns
