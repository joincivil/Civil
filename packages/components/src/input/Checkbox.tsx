import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";
import { CheckboxTheme } from "./SlideCheckbox";

export enum CheckboxSizes {
  SMALL = "SMALL",
}

interface BoxProps {
  locked?: boolean;
  size?: CheckboxSizes;
}

const Box = styled.span`
  position: absolute;
  cursor: ${(props: BoxProps) => (props.locked ? "default" : "pointer")};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 4px;
    top: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "1" : "0")}px;
    width: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "3" : "5")}px;
    height: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "7" : "10")}px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;

interface ContainerProps {
  locked?: boolean;
  theme?: CheckboxTheme;
  size?: CheckboxSizes;
}

const Container = styled<ContainerProps, "label">("label")`
  position: relative;
  display: inline-block;
  box-sizing: content-box;
  width: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "16" : "20")}px;
  height: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "16" : "20")}px;
  vertical-align: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "middle" : "bottom")};

  input {
    display: none;
  }
  input + ${Box} {
    border-radius: 2px;
    color: transparent;
    border: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "1" : "2")}px solid
      ${props => props.theme.checkboxInactiveColor};
    background-color: transparent;
  }
  input:checked + ${Box} {
    color: ${colors.basic.WHITE};
    border: ${(props: ContainerProps) => (props.size === CheckboxSizes.SMALL ? "1" : "2")}px solid
      ${props => props.theme.checkboxActiveColor};
    background-color: ${props => props.theme.checkboxActiveColor};
    opacity: ${(props: ContainerProps) => (props.locked ? 0.7 : 1)};
  }
  input:checked + ${Box}:after {
    display: block;
  }
`;

export const DEFAULT_CHECKBOX_THEME = {
  checkboxInactiveColor: colors.accent.CIVIL_GRAY_2,
  checkboxActiveColor: colors.accent.CIVIL_BLUE,
};

Container.defaultProps = {
  theme: DEFAULT_CHECKBOX_THEME,
};

export interface CheckboxProps {
  checked: boolean;
  locked?: boolean;
  size?: CheckboxSizes;
  id?: string;
  onClick(): void;
}

export const Checkbox = (props: CheckboxProps) => {
  return (
    <Container locked={props.locked} size={props.size}>
      <input
        onChange={() => {
          if (!props.locked) {
            props.onClick();
          }
        }}
        checked={props.checked}
        id={props.id}
        type="checkbox"
      />
      <Box locked={props.locked} size={props.size} />
    </Container>
  );
};
