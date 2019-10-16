import * as React from "react";
import styled from "styled-components";
import { fonts } from "../text/fonts";
import { colors } from "../colors/index";

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
  label?: string | JSX.Element;
  noLabel?: boolean;
  inputRef?:
    | ((instance: HTMLInputElement | HTMLTextAreaElement | null) => void)
    | React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  invalid?: boolean;
  disabled?: boolean;
  invalidMessage?: string;
  name: string;
  value?: string;
  placeholder?: string;
  autocomplete?: string;
  pattern?: string;
  defaultValue?: any;
  type?: string;
  min?: string;
  step?: string;
  onBlur?(ev: any): void;
  onFocus?(ev: any): void;
  onKeyPress?(ev: any): void;
  onChange?(name: string, value: string | null): void;
}

const InputBaseWrapperComponent: React.FunctionComponent<InputBaseProps> = props => {
  const { icon, className, label, noLabel, invalid, invalidMessage } = props;
  return (
    <div className={`${invalid ? "civil-input-error" : ""} ${className}`}>
      {invalid && invalidMessage && <ErrorMessage>{invalidMessage}</ErrorMessage>}
      {icon ? <InputIcon>{icon}</InputIcon> : null}
      {props.children}
      {!noLabel && <InputLabel>{label || props.placeholder}</InputLabel>}
    </div>
  );
};

const InputBaseComponent = (props: InputBaseProps) => {
  const { onChange, inputRef, invalid, noLabel, invalidMessage, ...inputProps } = props;
  let cb;
  if (onChange) {
    cb = (ev: any) => onChange(props.name, ev.target.value);
  }

  if (inputProps.type === "textarea") {
    return (
      <InputBaseWrapperComponent {...props}>
        <textarea {...inputProps} onChange={cb} ref={inputRef as any}>
          {inputProps.value}
        </textarea>
      </InputBaseWrapperComponent>
    );
  }

  return (
    <InputBaseWrapperComponent {...props}>
      <input {...inputProps} onChange={cb} ref={inputRef as any} />
    </InputBaseWrapperComponent>
  );
};

export const InputBase = styled(InputBaseComponent)`
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
  autocomplete?: string;
  label?: string | JSX.Element;
  icon?: JSX.Element;
  className?: string;
  invalid?: boolean;
  disabled?: boolean;
  invalidMessage?: string;
  noLabel?: boolean;
  readOnly?: boolean;
  inputRef?:
    | ((instance: HTMLInputElement | HTMLTextAreaElement | null) => void)
    | React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  type?: string;
  min?: string;
  step?: string;
  onBlur?(ev: any): void;
  onFocus?(ev: any): void;
  onKeyPress?(ev: any): void;
  onChange?(name: string, value: string): any;
}

export const TextInput = (props: InputProps) => {
  return <InputBase type="text" {...props} />;
};

export const NumericInput = (props: InputProps) => {
  return <InputBase type="number" {...props} />;
};

export interface CurrencyProps extends InputProps {
  currency: string;
}
export const CurrencyInput = (props: InputProps) => {
  const icon = props.icon || <span>USD</span>;
  return <InputBase type="number" {...props} icon={icon} />;
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

export const TextareaInput = (props: TextareaProps & InputProps) => {
  return <InputBase type="textarea" {...props} />;
};

export const URLInput = (props: InputProps) => {
  return <InputBase type="url" pattern="https?://.+" {...props} />;
};
