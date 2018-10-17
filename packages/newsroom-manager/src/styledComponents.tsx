import { colors, fonts, Button, ButtonProps, TextInput, TextareaInput, InputProps } from "@joincivil/components";
// tslint:disable-next-line:no-unused-variable
import * as React from "react"; // needed to export styled components
import styled, { StyledComponentClass } from "styled-components";

export const FormSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding-top: 10px;
  padding-bottom: 40px;
`;

export const FormTitle = styled.h4`
  font-size: 16px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-right: 15px;
`;

export interface FormSubheadProps {
  optional?: any;
}
export const FormSubhead = styled<FormSubheadProps, "h4">("h4")`
  font-size: 14px;
  font-weight: 500;
  color: #23282d;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 5px;

  ${props =>
    props.optional &&
    `
    &:after {
      content: " (optional)";
      font-style: italic;
    }
  `};
`;

export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const FormRowItem = styled.div`
  flex: 1;
  padding-right: 15px;
  &:last-child {
    padding-right: 0;
  }
`;

export const HelperText = styled.div`
  margin-top: -6px;
  padding-left: 15px;
  font-size: 13px;
  color: #72777c;
`;

export const TertiaryButton: StyledComponentClass<ButtonProps, any> = styled(Button)`
  border-radius: 3px;
  background-color: #f7f7f7;
  border: solid 1px #cccccc;
  font-size: 13px;
  font-weight: normal;
  color: #555555;
  &:active,
  &:hover {
    border-radius: 3px;
    background-color: #f7f7f7;
    border: solid 1px #cccccc;
    color: #555555;
  }
`;

export const StyledTextInput: StyledComponentClass<InputProps, any> = styled(TextInput)`
  position: relative;
  small {
    position: absolute;
    width: 100%;
    top: 45px;
    right: 15px;
    text-align: right;
  }
`;

export const StyledTextareaInput: StyledComponentClass<InputProps, any> = styled(TextareaInput)`
  position: relative;
  small {
    position: absolute;
    width: 100%;
    top: 75px;
    right: 15px;
    text-align: right;
  }
`;
