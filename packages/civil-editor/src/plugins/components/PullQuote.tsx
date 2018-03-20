import * as React from "react";
import * as ReactDom from "react-dom";
import styled from "styled-components";
import { Mark } from "slate";
import { constants } from "../index";

export interface PullQuoteState {
  destination?: HTMLElement | null | void;
  top: number;
}

export interface StyledQuoteProps {
  [key: string]: any;
}

const StyledQuote = styled<StyledQuoteProps, "p">("p")`
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  border-bottom: 5px solid #000000;
  font-size: 26px;
  padding-bottom: 10px;
  margin-right: 30px;
  cursor: ${(props) => props.readOnly ? "text" : "move"};
  position: absolute;
  top: ${(props) => props.top || 0}px
`;

export class PullQuote extends React.Component<any, PullQuoteState> {
  private constructor(props: any) {
    super(props);
    this.state = {
      top: this.props.mark.data.get("top"),
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }
  public componentDidMount(): void {
    this.setState({
      destination: document.getElementById("civil-pull-quotes"),
    });
  }
  public movePullQuoteStart(e: any): void {
    if (this.props.editor.props.readOnly) {
      return;
    }
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }
  public onMouseMove(event: MouseEvent): void {
    this.setState({
      top: this.state.top + event.movementY,
    });
  }
  public onMouseUp(event: Event): void {
    this.props.editor.change((change: any): void => {
      change.setMarkByKey(
        this.props.node.key,
        this.props.offset,
        this.props.text.length,
        this.props.mark,
        {
          data: {top: this.state.top},
        },
      );
    });
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }
  public render(): JSX.Element {
    let portalRendered;
    if (this.state.destination) {
      portalRendered = ReactDom.createPortal(
        <StyledQuote
          readOnly={this.props.editor.props.readOnly }
          onMouseDown={(e: any): void => this.movePullQuoteStart(e)}
          top={this.state.top}
          {...this.props}/>,
        this.state.destination,
      );
    }
    return (<>
      {portalRendered}
      <span {...this.props}/>
    </>);
  }
}
