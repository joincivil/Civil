import * as React from "react";
import { Link } from "react-router-dom";

export interface NavLinkProps {
  to?: string;
  href?: string;
  target?: string;
}

export class NavLink extends React.Component<NavLinkProps> {
  public render(): JSX.Element {
    let LinkType;

    if (this.props.to) {
      LinkType = <Link to={this.props.to}>{this.props.children}</Link>;
    } else if (this.props.href) {
      LinkType = (
        <a href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      );
    }

    return <>{LinkType}</>;
  }
}
