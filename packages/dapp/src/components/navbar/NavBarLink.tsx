import * as React from "react";
import { Link } from "react-router-dom";
import NavBarSpan from "./NavBarSpan";

export interface NavBarLinkProps {
  to: string;
  big?: boolean;
}

class NavBarLink extends React.Component<NavBarLinkProps> {
  constructor(props: NavBarLinkProps) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <Link to={this.props.to} style={{ textDecoration: "none", color: "white" }}>
        <NavBarSpan big={this.props.big}>{this.props.children}</NavBarSpan>
      </Link>
    );
  }
}

export default NavBarLink;
