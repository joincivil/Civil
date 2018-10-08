import { colors, fonts, Button, ButtonProps } from "@joincivil/components";
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

export const FormSubhead = styled.h4`
  font-size: 14px;
  color: #23282d;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 5px;
`;

export const TertiaryButton: StyledComponentClass<ButtonProps, "button"> = Button.extend`
  border-radius: 3px;
  background-color: #f7f7f7;
  border: solid 1px #cccccc;
  font-size: 13px;
  font-weight: normal;
  color: #555555;
  margin: 1em 0;
  &:active,
  &:hover {
    border-radius: 3px;
    background-color: #f7f7f7;
    border: solid 1px #cccccc;
    color: #555555;
    margin: 1em 0;
  }
`;
