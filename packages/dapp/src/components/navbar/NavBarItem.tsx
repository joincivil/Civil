import * as React from "react";
import styled from "styled-components";
export interface StyledLIProps {
  right?: boolean;
}

const StyledLI = styled<StyledLIProps, "li">("li")`
  ${(props: StyledLIProps): string => (props.right ? "margin-left: auto" : "")};
`;

export interface NavBarItemProps {
  right?: boolean;
}

class NavBarItem extends React.Component<NavBarItemProps> {
  constructor(props: NavBarItemProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <StyledLI right={this.props.right}>{this.props.children}</StyledLI>;
  }
}

export default NavBarItem;
