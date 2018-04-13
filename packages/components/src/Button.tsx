import * as React from "react";
import { Link } from "react-router-dom";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export interface ButtonProps {
  className?: string;
  icon?: any;
  to?: string;
  active?: boolean;
  disabled?: boolean;
  inputRef?: any;
  name?: string;
  onClick?(ev: any): any;
}
export const ButtonComponent: React.StatelessComponent<ButtonProps> = props => {
  const activeClass = props.active ? " active" : "";
  const { children, className, onClick, disabled, to } = props;

  if (to) {
    return (
      <Link className={className + activeClass} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className + activeClass} onClick={onClick} type="button" disabled={props.disabled}>
      {children}
    </button>
  );
};

const BaseButton = styled(ButtonComponent)`
  text-decoration: none;
  padding: 20px 50px;
  font-family: ${fonts.SANS_SERIF};
  cursor: pointer;
  border: none;
  letter-spacing: 2px;
  transition: background-color 500ms;
  outline: none;
  display: block;
`;

export const Button = BaseButton.extend`
  background-color: ${colors.accent.CIVIL_BLUE};
  color: ${colors.basic.WHITE};
  text-transform: uppercase;
  &:hover {
    background-color: ${colors.accent.CIVIL_BLUE_FADED};
    color: ${colors.basic.WHITE};
  }
  :disabled {
    background-color: ${colors.accent.CIVIL_BLUE_VERY_FADED};
  }
`;

export const InvertedButton = BaseButton.extend`
  text-transform: uppercase;
  background-color: ${colors.basic.WHITE};
  color: ${colors.accent.CIVIL_BLUE};
  border: 2px solid ${colors.accent.CIVIL_BLUE};
  &:hover {
    background-color: ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
`;

export const SecondaryButton = BaseButton.extend`
  background-color: ${colors.basic.WHITE};
  color: ${colors.accent.CIVIL_GRAY_2};
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  &.active {
    background-color: ${colors.accent.CIVIL_BLUE};
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
  &.active {
    background-color: ${colors.accent.CIVIL_BLUE};
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
`;

export const CancelButton = SecondaryButton.extend`
  color: ${colors.accent.CIVIL_BLUE};
  border: none;
  &:hover {
    background-color: ${colors.accent.CIVIL_RED_VERY_FADED};
    color: ${colors.accent.CIVIL_RED};
  }
`;
