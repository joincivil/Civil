import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../colors";
import { fonts } from "../text";
import { ClipLoader } from "../icons";

export enum buttonSizes {
  SMALL = "SMALL",
  SMALL_WIDE = "SMALL_WIDE",
  MEDIUM = "MEDIUM",
  MEDIUM_WIDE = "MEDIUM_WIDE",
  LARGE = "LARGE",
  NEW_MEDIUM = "NEW_MEDIUM",
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
  children?: any;
  // TODO(jorgelo): When a button with textTransform={"none"}, react throw this warning: React does not recognize the `textTransform` prop on a DOM element.
  textTransform?: string;
  type?: "button" | "reset" | "submit" | undefined;
  loading?: boolean;
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

const NEW_PRIMARY_BUTTON_DEFAULT_THEME = {
  newPrimaryButtonBackground: colors.basic.WHITE,
  newPrimaryButtonColor: colors.primary.BLACK,
  newPrimaryButtonBorder: colors.accent.CIVIL_GRAY_7,
  sansSerifFont: fonts.SANS_SERIF_BOLD,
  newPrimaryButtonFontWeight: "700",
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
  ...NEW_PRIMARY_BUTTON_DEFAULT_THEME,
  ...SECONDARY_BUTTON_DEFAULT_THEME,
  ...DARK_BUTTON_DEFAULT_THEME,
  ...BORDERLESS_BUTTON_DEFAULT_THEME,
};

const paddingObject: { [index: string]: string } = {
  [buttonSizes.SMALL]: "8px 12px",
  [buttonSizes.SMALL_WIDE]: "8px 60px",
  [buttonSizes.MEDIUM]: "10px 25px",
  [buttonSizes.NEW_MEDIUM]: "10px 25px",
  [buttonSizes.MEDIUM_WIDE]: "9px 30px",
  [buttonSizes.LARGE]: "20px 50px",
};

const spacingObject: { [index: string]: string } = {
  [buttonSizes.SMALL]: "0.5px",
  [buttonSizes.SMALL_WIDE]: "0.2px",
  [buttonSizes.MEDIUM]: "1px",
  [buttonSizes.NEW_MEDIUM]: ".18px",
  [buttonSizes.MEDIUM_WIDE]: "0.2px",
  [buttonSizes.LARGE]: "3px",
};

const fontObject: { [index: string]: string } = {
  [buttonSizes.SMALL]: "12px",
  [buttonSizes.MEDIUM]: "18px",
  [buttonSizes.NEW_MEDIUM]: "12px",
  [buttonSizes.MEDIUM_WIDE]: "14px",
  [buttonSizes.LARGE]: "24px",
};

const lineHeight: { [index: string]: string } = {
  [buttonSizes.SMALL]: "12px",
  [buttonSizes.MEDIUM]: "18px",
  [buttonSizes.NEW_MEDIUM]: "14px",
  [buttonSizes.MEDIUM_WIDE]: "14px",
  [buttonSizes.LARGE]: "24px",
};

export const ButtonComponent = (props: ButtonProps) => {
  const activeClass = props.active ? " active" : "";
  const disabledClass = props.disabled ? " disabled" : "";
  const { children, className, onClick, disabled, to, href, target, type, inputRef, loading } = props;

  const inner = loading ? <ClipLoader size={24} /> : children;

  if (to) {
    return (
      <Link {...props} className={className + activeClass + disabledClass} to={to} ref={inputRef}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a {...props} className={className + activeClass + disabledClass} href={href} target={target} ref={inputRef}>
        {inner}
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
      {inner}
    </button>
  );
};

const BaseButton = styled(ButtonComponent)`
  text-decoration: none;
  border-radius: 3px;
  padding: ${(props: any) => paddingObject[props.size || buttonSizes.LARGE]};
  font-family: ${(props: any) => props.theme.sansSerifFont};
  cursor: pointer;
  border: none;
  letter-spacing: ${(props: any) => spacingObject[props.size || buttonSizes.LARGE]};
  font-size: ${(props: any) => fontObject[props.size || buttonSizes.LARGE]};
  transition: color 500ms, background-color 500ms, border-color 500ms;
  outline: none;
  display: inline-block;
  ${(props: any) => (props.width ? `width: ${props.width}px;` : "")};
  ${(props: any) => (props.fullWidth ? "width: 100%;" : "")};
`;

export const Button = styled(BaseButton)`
  background-color: ${props => props.theme.primaryButtonBackground};
  border: 2px solid ${props => props.theme.primaryButtonBackground};
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
    cursor: default;
    background-color: ${props => props.theme.primaryButtonDisabledBackground};
    color: ${props => props.theme.primaryButtonDisabledColor};
    border-color: transparent;
  }

  ${ClipLoader} {
    border-color: ${props => props.theme.primaryButtonColor};
    border-bottom-color: transparent;
  }
`;

Button.defaultProps = {
  theme: PRIMARY_BUTTON_DEFAULT_THEME,
};

export const InvertedButton = styled(BaseButton)`
  text-transform: ${props => (props.textTransform ? props.textTransform : "uppercase")};
  background-color: ${props => props.theme.invertedButtonBackground};
  color: ${props => props.theme.invertedButtonColor};
  border: 2px solid ${props => props.theme.invertedButtonColor};
  &:focus,
  &:active,
  &:hover {
    background-color: ${props => props.theme.invertedButtonColor};
    color: ${props => props.theme.invertedButtonBackground};
  }

  ${ClipLoader} {
    border-color: ${props => props.theme.invertedButtonColor};
    border-bottom-color: transparent;
  }
`;

InvertedButton.defaultProps = {
  theme: INVERTED_BUTTON_DEFAULT_THEME,
};

export const NewPrimaryButton = styled(BaseButton)`
  background-color: ${props => props.theme.newPrimaryButtonBackground};
  color: ${props => props.theme.newPrimaryButtonColor};
  border: 1px solid ${props => props.theme.newPrimaryButtonBorder};
  font-family: ${(props: any) => props.theme.sansSerifFont};
  font-weight: ${props => props.theme.newPrimaryButtonFontWeight};
  line-height: ${(props: any) => lineHeight[props.size || buttonSizes.NEW_MEDIUM]};
`;

NewPrimaryButton.defaultProps = {
  theme: NEW_PRIMARY_BUTTON_DEFAULT_THEME,
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

  ${ClipLoader} {
    border-color: ${props => props.theme.secondaryButtonColor};
    border-bottom-color: transparent;
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

  ${ClipLoader} {
    border-color: ${props => props.theme.darkButtonColor};
    border-bottom-color: transparent;
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
  padding: ${paddingObject[buttonSizes.SMALL]};
  font-size: ${props => props.theme.borderlessButtonSize};
  background-color: transparent;
  &:focus,
  &:active,
  &:hover {
    background-color: transparent;
    color: ${props => props.theme.borderlessButtonHoverColor};
  }

  ${ClipLoader} {
    border-color: ${props => props.theme.borderlessButtonColor};
    border-bottom-color: transparent;
  }
`;

BorderlessButton.defaultProps = {
  theme: BORDERLESS_BUTTON_DEFAULT_THEME,
};
