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
  color: #000;
  font-family: ${fonts.SANS_SERIF};
`;

export const ErrorMessage = styled.small`
  color: ${colors.accent.CIVIL_RED};
  font-family: ${fonts.SANS_SERIF};
`;

export interface InputBaseProps {
  className?: string;
  icon?: JSX.Element;
  label?: string;
  noLabel?: boolean;
  inputRef?: string;
  invalid?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  name: string;
  value?: string;
  placeholder?: string;
  defaultValue?: any;
  type?: string;
  min?: string;
  step?: string;
  onKeyPress?(ev: any): void;
  onChange?(name: string, value: string | null): void;
}

const InputBaseWrapperComponent: React.StatelessComponent<InputBaseProps> = props => {
  const { icon, className, label, noLabel, invalid, errorMessage } = props;
  return (
    <div className={`${invalid ? "civil-input-error" : ""} ${className}`}>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {icon ? <InputIcon>{icon}</InputIcon> : null}
      {props.children}
      {!noLabel && <InputLabel>{label || props.placeholder}</InputLabel>}
    </div>
  );
};

const InputBaseComponent: React.StatelessComponent<InputBaseProps> = props => {
  const { onChange, inputRef, invalid, noLabel, errorMessage, ...inputProps } = props;
  let cb;
  if (onChange) {
    cb = (ev: any) => onChange(props.name, ev.target.value);
  }

  if (inputProps.type === "textarea") {
    return (
      <InputBaseWrapperComponent {...props}>
        <textarea {...inputProps} onChange={cb} ref={inputRef}>
          {inputProps.value}
        </textarea>
      </InputBaseWrapperComponent>
    );
  }

  return (
    <InputBaseWrapperComponent {...props}>
      <input {...inputProps} onChange={cb} ref={inputRef} />
    </InputBaseWrapperComponent>
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
  > input,
  > textarea {
    box-sizing: border-box;
    font-size: inherit;
    margin: 5px 0px 10px 0;
    padding: 10px;
    border: 1px solid ${colors.accent.CIVIL_GRAY_3};
    outline: none;
  }
  > input::placeholder,
  > textarea::placeholder {
    color: ${colors.accent.CIVIL_GRAY_3};
  }
  > input:focus,
  > textarea:focus {
    border-bottom: 1px solid ${colors.accent.CIVIL_BLUE};
  }
  &.civil-input-error {
    color: ${colors.accent.CIVIL_RED};
  }
  &.civil-input-error > input {
    color: ${colors.accent.CIVIL_RED};
    border-bottom-color: ${colors.accent.CIVIL_RED};
  }
`;

export interface InputProps {
  name: string;
  value?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  noLabel?: boolean;
  readOnly?: boolean;
  onKeyPress?(ev: any): void;
  onChange?(name: string, value: string): any;
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

export interface TextareaProps {
  height?: string;
  maxLength?: string;
}

export const TextareaInput: React.StatelessComponent<TextareaProps & InputProps> = props => {
  return <InputBase type="textarea" {...props} />;
};
