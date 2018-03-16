import * as React from "react";
import * as ReactDom from "react-dom";
import styled from "styled-components";

export interface PullQuoteState {
  destination?: HTMLElement | null | void;
}

const StyledQuote = styled.p`
  font-family: "Libre Franklin", sans-serif;
  font-weight: 700;
  border-bottom: 5px solid #000000;
  font-size: 26px;
  padding-bottom: 10px;
`;

export class PullQuote extends React.Component<any, PullQuoteState> {
  private constructor(props: any) {
    super(props);
    this.state = {};
  }
  public componentDidMount(): void {
    this.setState({
      destination: document.getElementById("civil-pull-quotes")
    });
  }
  public render(): JSX.Element {
    let portalRendered;
    if (this.state.destination) {
      portalRendered = ReactDom.createPortal(
        <StyledQuote {...this.props}/>,
        this.state.destination,
      );
    }
    return (<>
      {portalRendered}
      <span {...this.props}/>
    </>);
  }
}
