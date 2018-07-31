import * as React from "react";
import styled from "styled-components";

export interface StyledSpanProps {
  big?: boolean;
}

const StyledSpan = styled<StyledSpanProps, "span">("span")`
  padding-right: 18px;
  padding-left: 18px;
  color: white;
  font-family: "Libre Franklin", sans-serif;
  font-weight: ${(props: StyledSpanProps): string => (props.big ? "400" : "600")};
  font-size: ${(props: StyledSpanProps): string => (props.big ? "20pt" : "12pt")};
  white-space: ${(props: StyledSpanProps): string => (props.big ? "no-wrap" : "normal")};
  letter-spacing: ${(props: StyledSpanProps): string => (props.big ? "-0.35px" : "normal")};
`;

export interface NavBarSpanProps {
  big?: boolean;
}

class NavBarSpan extends React.Component<NavBarSpanProps> {
  constructor(props: NavBarSpanProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <StyledSpan big={this.props.big}>{this.props.children}</StyledSpan>;
  }
}

export default NavBarSpan;
