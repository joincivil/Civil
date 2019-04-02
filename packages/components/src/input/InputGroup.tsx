import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";
import { TextInput, InputLabel, InputProps, ErrorMessage } from "./Input";

const StyledInputGroupContainer = styled.div`
  margin: 0 0 10px;
`;

const StyledInputGroup = styled.div`
  align-items: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  margin: 5px 0;
  width: 100%;

  & > div {
    margin-bottom: 0;
  }
  && input {
    margin: 0;
  }
`;

const StyledInputGroupPrepend = styled.div`
  display: flex;
  box-sizing: border-box;

  & > span {
    margin-right: -1px;
  }
`;

const StyledInputGroupAppend = styled.div`
  display: flex;
  box-sizing: border-box;

  & > span {
    margin-left: -1px;
  }
`;

interface InputGroupTextProps {
  noPadding?: boolean;
}

const InputGroupText = styled.span`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  display: flex;
  font-size: inherit;
  padding: ${(props: InputGroupTextProps) => (props.noPadding ? "0" : "10px")};
  text-align: center;
  white-space: nowrap;
`;

const InputGroupAppend: React.FunctionComponent<InputGroupTextProps> = props => {
  return (
    <StyledInputGroupAppend>
      <InputGroupText noPadding={props.noPadding}>{props.children}</InputGroupText>
    </StyledInputGroupAppend>
  );
};

const InputGroupPrepend: React.FunctionComponent = props => {
  return (
    <StyledInputGroupPrepend>
      <InputGroupText>{props.children}</InputGroupText>
    </StyledInputGroupPrepend>
  );
};

export interface InputGroupProps {
  append?: string | JSX.Element;
  prepend?: string | JSX.Element;
  noAppendPadding?: boolean;
  inputComponent?: React.ComponentClass<any> | React.FunctionComponent<any>;
}

export const InputGroup: React.FunctionComponent<InputGroupProps & InputProps> = (props: any) => {
  const { label, append, prepend, placeholder, noAppendPadding, invalid, invalidMessage, ...inputProps } = props;
  const Input = props.inputComponent || TextInput;

  return (
    <StyledInputGroupContainer>
      {!props.noLabel && <InputLabel>{label || placeholder}</InputLabel>}
      <StyledInputGroup>
        {prepend && <InputGroupPrepend>{props.prepend}</InputGroupPrepend>}
        <Input noLabel={true} {...inputProps} />
        {append && <InputGroupAppend noPadding={noAppendPadding}>{props.append}</InputGroupAppend>}
      </StyledInputGroup>
      {invalid && invalidMessage && <ErrorMessage>{invalidMessage}</ErrorMessage>}
    </StyledInputGroupContainer>
  );
};
