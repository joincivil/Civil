import * as React from "react";
import { Link } from "react-router-dom";
import styled, { StyledComponentClass } from "styled-components";

import { colors, fonts } from "./styleConstants";

export enum buttonSizes {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
};

export interface ButtonProps {
  className?: string;
  icon?: any;
  to?: string;
  active?: boolean;
  disabled?: boolean;
  inputRef?: any;
  name?: string;
  size?: buttonSizes;
  onClick?(ev: any): void;
}

const sizesObject: {[index: string]: string} = {
  [buttonSizes.SMALL]: "8px 12px",
  [buttonSizes.MEDIUM]: "10px 25px",
  [buttonSizes.LARGE]: "20px 50px",
};

const spacingObject: {[index: string]: string} = {
  [buttonSizes.SMALL]: "0.5px",
  [buttonSizes.MEDIUM]: "1px",
  [buttonSizes.LARGE]: "3px",
};

const fontObject: {[index: string]: string} = {
  [buttonSizes.SMALL]: "12px",
  [buttonSizes.MEDIUM]: "18px",
  [buttonSizes.LARGE]: "24px",
};

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
    <button className={className + activeClass} onClick={onClick} type="button" disabled={disabled}>
      {children}
    </button>
  );
};

const BaseButton = styled(ButtonComponent)`
  text-decoration: none;
  border-radius: 2px;
  padding: ${props => sizesObject[props.size || buttonSizes.LARGE]};
  font-family: ${fonts.SANS_SERIF};
  cursor: pointer;
  border: none;
  letter-spacing: ${props => spacingObject[props.size || buttonSizes.LARGE]};
  font-size: ${props => fontObject[props.size || buttonSizes.LARGE]};
  transition: background-color 500ms;
  outline: none;
  display: inline-block;
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
