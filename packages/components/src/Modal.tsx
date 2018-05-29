import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";

interface ToggleDisplayEl {
  visible: boolean;
}

const ModalOuter = styled<ToggleDisplayEl, "div">("div")`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  display: ${props => (props.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled.div`
  box-shadow: 0px 0px 20px 5px rgba(100, 100, 100, 0.4);
  max-width: 400px;
  padding: 35px;
  padding-bottom: 50px;
  background: #fff;
`;

export interface ModalPropsAndState {
  visible?: boolean;
}

export class Modal extends React.Component<ModalPropsAndState, ModalPropsAndState> {
  private static getDerivedStateFromProps(props: ModalPropsAndState, state: ModalPropsAndState): any | null {
    if (typeof props.visible !== "undefined") {
      const visible = props.visible;
      return { visible };
    }
    return null;
  }

  public bucket: HTMLDivElement = document.createElement("div");

  public constructor(props: any) {
    super(props);

    this.state = {
      visible: this.props.visible || true,
    };
  }

  public componentDidMount(): void {
    document.body.appendChild(this.bucket);
  }

  public componentWillUnmount(): void {
    document.body.removeChild(this.bucket);
  }

  public render(): React.ReactPortal {
    return ReactDOM.createPortal(
      <ModalOuter visible={this.props.visible!}>
        <ModalInner>{this.props.children}</ModalInner>
      </ModalOuter>,
      this.bucket,
    );
  }
}
