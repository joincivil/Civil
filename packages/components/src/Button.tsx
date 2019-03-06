import * as React from "react";
import { Link } from "react-router-dom";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "./styleConstants";

export enum buttonSizes {
  SMALL = "SMALL",
  SMALL_WIDE = "SMALL_WIDE",
  MEDIUM = "MEDIUM",
  MEDIUM_WIDE = "MEDIUM_WIDE",
  LARGE = "LARGE",
}

export interface ButtonProps {
  className?: string;
  icon?: any;
  to?: string;
  active?: boolean;
  disabled?: boolean;
  inputRef?: any;
  name?: string;
  size?: buttonSizes;
  href?: string;
  target?: string;
  fullWidth?: boolean;
  width?: number;
  // TODO(jorgelo): When a button with textTransform={"none"}, react throw this warning: React does not recognize the `textTransform` prop on a DOM element.
  textTransform?: string;
  type?: string;
  onClick?(ev: any): void;
}

export interface ButtonTheme {
  primaryButtonBackground?: string;
  primaryButtonColor?: string;
  primaryButtonFontWeight?: string;
  primaryButtonHoverBackground?: string;
  primaryButtonDisabledBackground?: string;
  primaryButtonDisabledColor?: string;
  primaryButtonTextTransform?: string;
  invertedButtonBackground?: string;
  invertedButtonColor?: string;
  secondaryButtonBackground?: string;
  secondaryButtonColor?: string;
  secondaryButtonBorder?: string;
  secondaryButtonHoverBackground?: string;
  secondaryButtonHoverColor?: string;
  darkButtonBackground?: string;
  darkButtonColor?: string;
  darkButtonHoverColor?: string;
  darkButtonHoverBackground?: string;
  darkButtonTextTransform?: string;
  borderlessButtonColor?: string;
  borderlessButtonHoverColor?: string;
  borderlessButtonSize?: string;
  sansSerifFont?: string;
}

const PRIMARY_BUTTON_DEFAULT_THEME = {
  primaryButtonBackground: colors.accent.CIVIL_BLUE,
  primaryButtonColor: colors.basic.WHITE,
  primaryButtonFontWeight: "normal",
  primaryButtonHoverBackground: colors.accent.CIVIL_BLUE_FADED,
  primaryButtonDisabledBackground: colors.accent.CIVIL_BLUE_VERY_FADED,
  primaryButtonDisabledColor: colors.basic.WHITE,
  primaryButtonTextTransform: "uppercase",
  sansSerifFont: fonts.SANS_SERIF,
};

const INVERTED_BUTTON_DEFAULT_THEME = {
  invertedButtonBackground: colors.basic.WHITE,
  invertedButtonColor: colors.accent.CIVIL_BLUE,
};

const SECONDARY_BUTTON_DEFAULT_THEME = {
  secondaryButtonBackground: colors.basic.WHITE,
  secondaryButtonColor: colors.accent.CIVIL_GRAY_2,
  secondaryButtonBorder: colors.accent.CIVIL_GRAY_3,
  secondaryButtonHoverBackground: colors.accent.CIVIL_BLUE,
  secondaryButtonHoverColor: colors.basic.WHITE,
};

const DARK_BUTTON_DEFAULT_THEME = {
  darkButtonBackground: colors.primary.BLACK,
  darkButtonColor: colors.basic.WHITE,
  darkButtonHoverColor: colors.basic.WHITE,
  darkButtonHoverBackground: colors.accent.CIVIL_GRAY_1,
  darkButtonTextTransform: "none",
};

const BORDERLESS_BUTTON_DEFAULT_THEME = {
  borderlessButtonColor: colors.primary.CIVIL_BLUE_1,
  borderlessButtonHoverColor: colors.accent.CIVIL_BLUE_FADED,
  borderlessButtonSize: "15px",
};

export const DEFAULT_BUTTON_THEME = {
  ...PRIMARY_BUTTON_DEFAULT_THEME,
  ...INVERTED_BUTTON_DEFAULT_THEME,
  ...SECONDARY_BUTTON_DEFAULT_THEME,
  ...DARK_BUTTON_DEFAULT_THEME,
  ...BORDERLESS_BUTTON_DEFAULT_THEME,
};

const sizesObject: { [index: string]: string } = {
  [buttonSizes.SMALL]: "8px 12px",
  [buttonSizes.SMALL_WIDE]: "8px 60px",
  [buttonSizes.MEDIUM]: "10px 25px",
  [buttonSizes.MEDIUM_WIDE]: "9px 30px",
  [buttonSizes.LARGE]: "20px 50px",
};

const spacingObject: { [index: string]: string } = {
  [buttonSizes.SMALL]: "0.5px",
  [buttonSizes.SMALL_WIDE]: "0.2px",
  [buttonSizes.MEDIUM]: "1px",
  [buttonSizes.MEDIUM_WIDE]: "0.2px",
  [buttonSizes.LARGE]: "3px",
};

const fontObject: { [index: string]: string } = {
  [buttonSizes.SMALL]: "12px",
  [buttonSizes.MEDIUM]: "18px",
  [buttonSizes.MEDIUM_WIDE]: "14px",
  [buttonSizes.LARGE]: "24px",
};

export const ButtonComponent: React.StatelessComponent<ButtonProps> = props => {
  const activeClass = props.active ? " active" : "";
  const disabledClass = props.disabled ? " disabled" : "";
  const { children, className, onClick, disabled, to, href, target, type, inputRef } = props;

  if (to) {
    return (
      <Link {...props} className={className + activeClass + disabledClass} to={to} ref={inputRef}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a {...props} className={className + activeClass + disabledClass} href={href} target={target} ref={inputRef}>
        {children}
      </a>
    );
  }

  return (
    <button
      {...props}
      className={className + activeClass + disabledClass}
      onClick={onClick}
      type={type || "button"}
      disabled={disabled}
      ref={inputRef}
    >
      {children}
    </button>
  );
};

const BaseButton = styled(ButtonComponent)`
  text-decoration: none;
  border-radius: 2px;
  padding: ${props => sizesObject[props.size || buttonSizes.LARGE]};
  font-family: ${props => props.theme.sansSerifFont};
  cursor: pointer;
  border: none;
  letter-spacing: ${props => spacingObject[props.size || buttonSizes.LARGE]};
  font-size: ${props => fontObject[props.size || buttonSizes.LARGE]};
  transition: background-color 500ms;
  outline: none;
  display: inline-block;
  ${props => (props.width ? `width: ${props.width}px;` : "")};
  ${props => (props.fullWidth ? "width: 100%;" : "")};
`;

export const Button = styled(BaseButton)`
  background-color: ${props => props.theme.primaryButtonBackground};
  color: ${props => props.theme.primaryButtonColor};
  font-weight: ${props => props.theme.primaryButtonFontWeight};
  text-transform: ${props => (props.textTransform ? props.textTransform : props.theme.primaryButtonTextTransform)};
  &:focus,
  &:active,
  &:hover {
    background-color: ${props => props.theme.primaryButtonHoverBackground};
    color: ${props => props.theme.primaryButtonColor};
  }
  &:disabled {
    background-color: ${props => props.theme.primaryButtonDisabledBackground};
    color: ${props => props.theme.primaryButtonDisabledColor};
  }
`;

Button.defaultProps = {
  theme: PRIMARY_BUTTON_DEFAULT_THEME,
};

export const InvertedButton = styled(BaseButton)`
  text-transform: uppercase;
  background-color: ${props => props.theme.invertedButtonBackground};
  color: ${props => props.theme.invertedButtonColor};
  border: 2px solid ${props => props.theme.invertedButtonColor};
  &:focus,
  &:active,
  &:hover {
    background-color: ${props => props.theme.invertedButtonColor};
    color: ${props => props.theme.invertedButtonBackground};
  }
`;

InvertedButton.defaultProps = {
  theme: INVERTED_BUTTON_DEFAULT_THEME,
};

export const SecondaryButton = styled(BaseButton)`
  background-color: ${props => props.theme.secondaryButtonBackground};
  color: ${props => props.theme.secondaryButtonColor};
  border: 1px solid ${props => props.theme.secondaryButtonBorder};
  &:focus,
  &:hover,
  &.active {
    background-color: ${props => props.theme.secondaryButtonHoverBackground};
    border: 1px solid ${props => props.theme.secondaryButtonHoverBackground};
    color: ${props => props.theme.secondaryButtonHoverColor};
  }
`;

SecondaryButton.defaultProps = {
  theme: SECONDARY_BUTTON_DEFAULT_THEME,
};

export const DarkButton = styled(BaseButton)`
  background-color: ${props => props.theme.darkButtonBackground};
  color: ${props => props.theme.darkButtonColor};
  text-transform: ${props => props.theme.darkButtonTextTransform};
  &:focus,
  &:hover,
  &.active {
    color: ${props => props.theme.darkButtonHoverColor};
    background-color: ${props => props.theme.darkButtonHoverBackground};
  }
`;

DarkButton.defaultProps = {
  theme: DARK_BUTTON_DEFAULT_THEME,
};

export const CancelButton = styled(SecondaryButton)`
  color: ${colors.accent.CIVIL_BLUE};
  border: none;
  &:focus,
  &:active,
  &:hover {
    background-color: ${colors.accent.CIVIL_RED_VERY_FADED};
    border: none;
    color: ${colors.accent.CIVIL_RED};
  }
`;

export const BorderlessButton = styled(Button)`
  border: none;
  font-family: ${props => props.theme.sansSerifFont};
  color: ${props => props.theme.borderlessButtonColor};
  font-weight: 700;
  margin-left: 8px;
  letter-spacing: 0.7px;
  padding: ${sizesObject[buttonSizes.SMALL]};
  font-size: ${props => props.theme.borderlessButtonSize};
  background-color: transparent;
  &:focus,
  &:active,
  &:hover {
    background-color: transparent;
    color: ${props => props.theme.borderlessButtonHoverColor};
  }
`;

BorderlessButton.defaultProps = {
  theme: BORDERLESS_BUTTON_DEFAULT_THEME,
};
