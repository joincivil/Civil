import * as React from "react";
import { INPUT_STATE } from "./types";
import { colors, fonts, ErrorIcon } from "../";
import styled from "styled-components";

export interface InputValidationStyleProps {
  inputState?: string;
}

export const StripeElement = styled.div`
  border: 1px solid
    ${(props: InputValidationStyleProps) =>
      props.inputState === INPUT_STATE.INVALID ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_3};
  border-radius: 3px;
  padding: 12px;
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
  position: relative;
  width: 100%;

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 13px;
    line-height: 18px;
    margin: 5px 0 0;
  }

  input {
    border: 1px solid
      ${(props: InputValidationStyleProps) =>
        props.inputState === INPUT_STATE.INVALID ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_3};
    border-radius: 3px;
    font-size: 13px;
    padding: 10px 35px 10px 12px;
    width: 100%;

    &::placeholder {
      color: ${colors.accent.CIVIL_GRAY_1};
    }

    &:focus {
      border-color: ${colors.accent.CIVIL_BLUE};
      outline: none;
    }
  }

  select {
    appearance: none;
    background-color: transparent;
    border: 1px solid
      ${(props: InputValidationStyleProps) =>
        props.inputState === INPUT_STATE.INVALID ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_3};
    border-radius: 3px;
    display: block;
    font-family: ${fonts.SANS_SERIF};
    font-size: 13px;
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
  }

  &.positionTop {
    margin-bottom: 0;

    ${StripeElement},
    input,
    select {
      border-radius: 3px 3px 0 0;
    }
  }

  &.positionBottom {
    ${StripeElement},
    input,
    select {
      border-radius: 0 0 3px 3px;
      border-width: 0 1px 1px 1px;
    }
  }

  &.positionBottomLeft {
    ${StripeElement},
    input,
    select {
      border-radius: 0 0 0 3px;
      border-width: 0 0 1px 1px;
    }
  }

  &.positionBottomRight {
    ${StripeElement},
    input,
    select {
      border-radius: 0 0 3px;
      border-width: 0 1px 1px 1px;
    }
  }
`;

const InputErrorIcon = styled.div`
  display: ${(props: InputValidationStyleProps) => (props.inputState === INPUT_STATE.INVALID ? "block" : "none")};
  position: absolute;
  right: 5px;
  top: calc(50% - 10px);
`;

export interface InputValidationUIProps {
  children: any;
  className?: string;
  inputState: string;
}

export const InputValidationUI: React.FunctionComponent<InputValidationUIProps> = props => {
  return (
    <>
      <InputWrapper inputState={props.inputState} className={props.className}>
        {props.children}
        <InputErrorIcon inputState={props.inputState}>
          <ErrorIcon width={20} height={20} />
        </InputErrorIcon>
      </InputWrapper>
    </>
  );
};
