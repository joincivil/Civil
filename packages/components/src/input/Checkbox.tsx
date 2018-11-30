import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";
import { CheckboxTheme } from "./SlideCheckbox";

interface ContainerProps {
  locked?: boolean;
  theme?: CheckboxTheme;
}

const Box = styled.span`
  position: absolute;
  cursor: ${(props: ContainerProps) => (props.locked ? "default" : "pointer")};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 4px;
    top: 0px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;

const Container = styled<ContainerProps, "label">("label")`
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  input {
    display: none;
  }
  input + ${Box} {
    border-radius: 2px;
    color: transparent;
    border: 2px solid ${props => props.theme.checkboxInactiveColor};
    background-color: transparent;
  }
  input:checked + ${Box} {
    color: ${colors.basic.WHITE};
    border: 2px solid ${props => props.theme.checkboxActiveColor};
    background-color: ${props => props.theme.checkboxActiveColor};
    opacity: ${(props: ContainerProps) => (props.locked ? 0.7 : 1)};
  }
  input:checked + ${Box}:after {
    display: block;
  }
`;

Container.defaultProps = {
  theme: {
    checkboxInactiveColor: colors.accent.CIVIL_GRAY_2,
    checkboxActiveColor: colors.accent.CIVIL_BLUE,
  },
};

export interface CheckboxProps {
  checked: boolean;
  locked?: boolean;
  onClick(): void;
}

export const Checkbox = (props: CheckboxProps) => {
  return (
    <Container locked={props.locked}>
      <input onClick={props.onClick} checked={props.checked}} type="checkbox" />
      <Box locked={props.locked} />
    </Container>
  );
};
