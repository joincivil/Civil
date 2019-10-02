import * as React from "react";
import { colors, fonts, mediaQueries, ErrorIcon } from "../";
import styled from "styled-components";

export enum INPUT_STATE {
  EMPTY = "empty",
  VALID = "valid",
  INVALID = "invalid",
}

export interface InputValidationStyleProps {
  inputState?: string;
  width?: string;
}

const InputWrapper = styled.div`
  margin-bottom: 20px;
  position: relative;
  width: ${(props: InputValidationStyleProps) => (props.width ? props.width : "100%")};

  ${mediaQueries.MOBILE} {
    width: 100%;
  }

  input {
    border: 1px solid
      ${(props: InputValidationStyleProps) =>
        props.inputState === INPUT_STATE.INVALID ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_3};
    border-radius: 2px;
    padding: 10px 35px 10px 12px;
    width: 100%;

    &:focus {
      border-color: ${colors.accent.CIVIL_BLUE};
      outline: none;
    }

    ${mediaQueries.MOBILE} {
      width: 100%;
    }
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    border: 1px solid
      ${(props: InputValidationStyleProps) =>
        props.inputState === INPUT_STATE.INVALID ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_3};
    border-radius: 2px;
    display: block;
    font-family: ${fonts.SANS_SERIF};
    line-height: 16px;
    margin: 0;
    padding: 11px 12px 12px;
    width: 100%;

    &::-ms-expand {
      display: none;
    }

    &:hover {
      cursor: pointer;
    }

    &:focus {
      border-color: ${colors.accent.CIVIL_BLUE};
      outline: none;
    }

    ${mediaQueries.MOBILE} {
      width: 100%;
    }
  }
`;

const InputErrorIcon = styled.div`
  display: ${(props: InputValidationStyleProps) => (props.inputState === INPUT_STATE.INVALID ? "block" : "none")};
  position: absolute;
  right: 5px;
  top: calc(50% - 10px);
`;

export interface BoostModalProps {
  children: any;
  inputState: string;
  width?: string;
}

export const InputValidationUI: React.FunctionComponent<BoostModalProps> = props => {
  return (
    <>
      <InputWrapper inputState={props.inputState} width={props.width}>
        {props.children}
        <InputErrorIcon inputState={props.inputState}>
          <ErrorIcon width={20} height={20} />
        </InputErrorIcon>
      </InputWrapper>
    </>
  );
};
