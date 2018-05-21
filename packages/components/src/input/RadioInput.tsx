import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";

import { SecondaryButton } from "../Button";
import { InputLabel } from "./Input";
import { colors } from "../styleConstants";

export interface RadioButtonProps {
  className?: string;
  inputRef?: any;
  onChange?: any;
  value: any;
  disabled?: boolean;
  name?: string;
  defaultValue?: any;
}

export const RadioButtonDiv = styled.div`
  input {
    display: none;
  }
  input:checked + button {
    background-color: ${colors.accent.CIVIL_BLUE};
    border: 1px solid ${colors.accent.CIVIL_BLUE};
    color: ${colors.basic.WHITE};
  }
`;
export const RadioButton: React.StatelessComponent<RadioButtonProps> = props => {
  let input: any;
  const { onChange, children, name } = props;
  const clickHandler = () => {
    input.checked = true;
    if (onChange) {
      onChange(props.name, input.value);
    }
  };
  const defaultChecked = props.defaultValue === props.value;

  return (
    <RadioButtonDiv>
      <input type="radio" value={props.value} defaultChecked={defaultChecked} name={name} ref={ref => (input = ref)} />
      <SecondaryButton onClick={clickHandler} disabled={props.disabled}>
        {children}
      </SecondaryButton>
    </RadioButtonDiv>
  );
};

export interface RadioInputProps {
  name: string;
  label: string;
  defaultValue?: any;
  onChange?: any;
  inputRef?: any;
  className?: any;
}

const RadioDiv = styled.div`
  > div {
    display: flex;
    flex-direction: rows;
  }
`;
export const RadioInput: React.StatelessComponent<RadioInputProps> = props => {
  const { defaultValue, onChange, label, name, inputRef, children } = props;

  const childrenWithProps = React.Children.map(children, (child: React.ReactChild) =>
    React.cloneElement(child as React.ReactElement<any>, { name, onChange, defaultValue }),
  );

  return (
    <RadioDiv ref={inputRef}>
      {label ? <InputLabel>{label}</InputLabel> : null}
      <div>{childrenWithProps}</div>
    </RadioDiv>
  );
};
