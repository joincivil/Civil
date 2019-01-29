import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "styled-components";
import { mediaQueries } from "./styleConstants";

interface ToggleDisplayEl {
  visible: boolean;
}
interface TextAlignProps {
  textAlign?: string | undefined;
}

const ModalOuter = styled<ToggleDisplayEl & TextAlignProps, "div">("div")`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  display: ${props => (props.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  text-align: ${props => props.textAlign || "left"};
  z-index: 100001;
`;
// z-index to beat wp tools

interface ModalInnerProps {
  width?: number;
  padding?: string;
  fullScreen?: boolean;
}

const ModalInner = styled.div`
  box-shadow: 0px 0px 20px 5px rgba(100, 100, 100, 0.4);
  max-width: ${(props: ModalInnerProps) => props.width || 400}px;
  padding: ${(props: ModalInnerProps) => props.padding || "35px 35px 50px 35px"};
  background: #fff;
  ${(props: ModalInnerProps): string => {
    if (props.fullScreen) {
      return "max-width: 100%; width: 100%; height: 100%; overflow: scroll;";
    }
    return "";
  }}
  ${mediaQueries.MOBILE} {
    max-width: 100%;
  }
`;

export interface ModalPropsAndState {
  visible?: boolean;
  textAlign?: string;
  width?: number;
  padding?: string;
  fullScreen?: boolean;
}

export class Modal extends React.Component<ModalPropsAndState, ModalPropsAndState> {
  // tslint:disable-next-line
  private static getDerivedStateFromProps(props: ModalPropsAndState, state: ModalPropsAndState): any | null {
    if (typeof props.visible !== "undefined") {
      const visible = props.visible;
      return { visible };
    }
    return null;
  }

  public bucket: HTMLDivElement = document.createElement("div");

  public constructor(props: ModalPropsAndState) {
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
      <ModalOuter visible={this.state.visible!} textAlign={this.props.textAlign}>
        <ModalInner width={this.props.width} fullScreen={this.props.fullScreen} padding={this.props.padding}>
          {this.props.children}
        </ModalInner>
      </ModalOuter>,
      this.bucket,
    );
  }
}
