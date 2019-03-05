import * as React from "react";
import { Link } from "react-router-dom";

export interface NavLinkProps {
  to?: string;
  href?: string;
  target?: string;
  onClick?(): void;
}

export const NavLink: React.StatelessComponent<NavLinkProps> = props => {
  let LinkType;

  if (props.to) {
    LinkType = (
      <Link to={props.to} onClick={props.onClick}>
        {props.children}
      </Link>
    );
  } else if (props.href) {
    LinkType = (
      <a href={props.href} target={props.target} onClick={props.onClick}>
        {props.children}
      </a>
    );
  }

  return <>{LinkType}</>;
};
