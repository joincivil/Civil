import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { colors } from "../styleConstants";
import { TextInput, InputLabel, InputProps } from "./Input";

const StyledInputGroupContainer = styled.div`
  margin: 0 0 10px;
`;

const StyledInputGroup = styled.div`
  align-items: 100%;
  box-sizing: border-box;
  display: flex;
  position: relative;
  margin-top: 5px;
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

const InputGroupText = styled.span`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  display: flex;
  font-size: inherit;
  padding: 10px;
  text-align: center;
  white-space: nowrap;
`;

export const InputGroupPrepend: React.StatelessComponent = props => {
  return (
    <StyledInputGroupPrepend>
      <InputGroupText>{props.children}</InputGroupText>
    </StyledInputGroupPrepend>
  );
};

export interface InputGroupProps {
  prepend?: string;
}

export const InputGroup: React.StatelessComponent<InputGroupProps & InputProps> = (props: any) => {
  const { label, prepend, placeholder, name, onChange } = props;

  return (
    <StyledInputGroupContainer>
      <InputLabel>{label || props.placeholder}</InputLabel>
      <StyledInputGroup>
        {prepend && <InputGroupPrepend>{props.prepend}</InputGroupPrepend>}
        <TextInput noLabel={true} placeholder={placeholder} name={name} onChange={onChange} />
      </StyledInputGroup>
    </StyledInputGroupContainer>
  );
};
