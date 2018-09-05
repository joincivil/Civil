import * as React from "react";
import styled from "styled-components";
import { colors } from "../styleConstants";

export interface CheckboxTheme {
  checkboxActiveColor: string;
  checkboxInactiveColor: string;
}

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 34px;
  tansition: 0.4s;
  &:before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 1.7px;
    top: 1.7px;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

Slider.defaultProps = {
  theme: {
    checkboxInactiveColor: colors.accent.CIVIL_GRAY_2,
    checkboxActiveColor: colors.accent.CIVIL_BLUE,
  },
};

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 32px;
  height: 19px;
  input {
    display: none;
  }
  input + ${Slider} {
    background-color: transparent;
    border: 2px solid ${props => props.theme.checkboxInactiveColor};
  }
  input + ${Slider}:before {
    background-color: ${props => props.theme.checkboxInactiveColor};
  }
  input:checked + ${Slider} {
    border: 2px solid ${props => props.theme.checkboxActiveColor};
    background-color: ${props => props.theme.checkboxActiveColor};
  }
  input:focus + ${Slider} {
    box-shadow: 0 0 1px #2196f3;
  }
  input:checked + ${Slider}:before {
    background-color: ${colors.basic.WHITE};
    transform: translateX(12px);
  }
`;

Switch.defaultProps = {
  theme: {
    checkboxInactiveColor: colors.accent.CIVIL_GRAY_2,
    checkboxActiveColor: colors.accent.CIVIL_BLUE,
  },
};

export interface SlideCheckboxProps {
  checked: boolean;
  onClick(): void;
}

export const SlideCheckbox = (props: SlideCheckboxProps) => {
  return (
    <Switch>
      <input onClick={props.onClick} checked={props.checked} type="checkbox" />
      <Slider />
    </Switch>
  );
};
