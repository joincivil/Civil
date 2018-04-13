import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors, fonts } from "../styleConstants";

export const InputIcon = styled.div`
  position: relative;
  left: calc(100% - 50px);
  top: -30px;
`;

export const InputLabel = styled.label`
  font-size: 15px;
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
`;

export interface InputBaseProps {
  className?: string;
  icon?: JSX.Element;
  label?: string;
  inputRef?: string;

  name: string;
  value?: string;
  placeholder?: string;
  defaultValue?: any;
  type?: string;
  min?: string;
  step?: string;
  onChange?(name: string, value: string | null): void;
}

const InputBaseComponent: React.StatelessComponent<InputBaseProps> = props => {
  const { icon, onChange, className, label, inputRef, ...inputProps } = props;
  let cb;
  if (onChange) {
    cb = (ev: any) => onChange(props.name, ev.target.value);
  }
  return (
    <div className={className}>
      {icon ? <InputIcon>{icon}</InputIcon> : null}
      <input {...inputProps} onChange={cb} ref={inputRef} />
      <InputLabel>{label || props.placeholder}</InputLabel>
    </div>
  );
};

const InputBase = styled(InputBaseComponent)`
  margin-bottom: 10px;
  display: inline-grid;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  font-family: ${fonts.SANS_SERIF};
  > div {
    display: flex;
    flex-direction: row;
  }
  > input {
    margin: 5px 0px 10px 0;
    padding: 10px;
    border: none;
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    outline: none;
  }
  > input::placeholder {
    color: ${colors.accent.CIVIL_GRAY_3};
  }
  > input:focus + label {
    color: ${colors.accent.CIVIL_BLUE};
  }
  > input:focus {
    border-bottom: 1px solid ${colors.accent.CIVIL_BLUE};
  }
`;

export interface InputProps {
  name: string;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange(name: string, value: string): any;
}

export const TextInput: React.StatelessComponent<InputProps> = props => {
  return <InputBase type="text" {...props} />;
};

export const NumericInput: React.StatelessComponent<InputProps> = props => {
  return <InputBase type="number" min="0.01" step="0.01" {...props} />;
};

export interface CurrencyProps extends InputProps {
  currency: string;
}
export const CurrencyInput: React.StatelessComponent<InputProps> = props => {
  return <InputBase type="number" min="0.01" step="0.01" {...props} icon={<span>USD</span>} />;
};

export interface TextProps extends InputProps {
  currency: string;
}
export const HeaderInput = styled(TextInput)`
  > input {
    font-size: 25px;
  }
`;
