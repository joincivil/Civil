import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Link } from "react-router-dom";
import { colors, fonts } from "../styleConstants";

export interface DropdownProps {
  className?: string;
  position?: string; // right or left
  target: JSX.Element;
}

export interface DropdownState {
  open: boolean;
}

export class DropdownComponent extends React.Component<DropdownProps, DropdownState> {
  private wrapperRef: any;
  constructor(props: DropdownProps) {
    super(props);

    this.state = { open: false };

    this.toggle = this.toggle.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  public componentWillUnmount(): void {
    document.removeEventListener("mousedown", this.handleClickOutside.bind(this));
  }

  public render(): JSX.Element {
    return (
      <div className={this.props.className}>
        <div onClick={ev => this.toggle()}>{this.props.target}</div>
        {this.state.open ? (
          <div ref={ref => this.setWrapperRef(ref)}>
            <div>{this.props.children}</div>
          </div>
        ) : null}
      </div>
    );
  }

  private handleClickOutside(event: any): void {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggle();
    }
  }

  private setWrapperRef(node: any): void {
    this.wrapperRef = node;
  }
  private toggle(): void {
    if (this.state.open) {
      document.removeEventListener("mousedown", ev => this.handleClickOutside(ev));
    } else {
      document.addEventListener("mousedown", ev => this.handleClickOutside(ev));
    }

    this.setState({ open: !this.state.open });
  }
}

export const Dropdown = styled(DropdownComponent)`
  > div:first-child {
    cursor: pointer;
  }
  > div:nth-child(2) {
    font-family: ${fonts.SANS_SERIF};
    position: relative;
    z-index: 100;

    > div {
      position: absolute;
      ${props => (props.position === "left" ? "left" : "right")}: 3px;
      top: 10px;
      width: 200px;
      max-width: 200px;
      background-color: ${colors.basic.WHITE};
      box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px, rgba(0, 0, 0, 0.2) 0px 1px 2px;
      border: 1px solid ${colors.accent.CIVIL_GRAY_3};
      :before,
      :after {
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        border: 8px solid transparent; /* arrow size */
      }

      :before {
        border-bottom-color: white; /* arrow color */

        /* positioning */
        position: absolute;
        top: -15px;
        ${props => (props.position === "left" ? "left" : "right")}: 10px;
        z-index: 2;
      }

      :after {
        border-bottom-color: ${colors.accent.CIVIL_GRAY_3}; /* arrow color */

        /* positioning */
        position: absolute;
        top: -16px;
        ${props => (props.position === "left" ? "left" : "right")}: 10px;
        z-index: 1;
      }
    }
  }
`;

export const DropdownGroup = styled.ul`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  list-style-type: none;
  margin: 0;
  padding: 0;

  li:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;

export interface DropdownItemProps {
  className?: string;
}
const DropdownItemComponent: React.StatelessComponent<DropdownItemProps> = ({ className, children }) => {
  return <li className={className}>{children}</li>;
};

export const DropdownItem = styled(DropdownItemComponent)`
  display: block;
  text-decoration: none;
  color: black;
  padding: 15px;
  a:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;

export interface DropdownLinkProps {
  to: string;
  className?: string;
}
const DropdownLinkComponent: React.StatelessComponent<DropdownLinkProps> = ({ className, to, children }) => {
  return (
    <li className={className}>
      <Link to={to}>{children}</Link>
    </li>
  );
};

export const DropdownLink = styled(DropdownLinkComponent)`
  a {
    display: block;
    text-decoration: none;
    color: black;
    padding: 15px;
  }
  a:hover {
    background-color: ${colors.accent.CIVIL_GRAY_4};
  }
`;
