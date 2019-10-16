import * as React from "react";
import styled from "styled-components";
import { colors } from "../colors/index";
import { TipIcon } from "../icons/index";

export interface PaymentBtnStyleProps {
  border?: boolean;
}

export const PaymentBtnStyled = styled.button`
  align-items: center;
  border: ${(props: PaymentBtnStyleProps) => (props.border ? "1px solid" + colors.accent.CIVIL_BLUE : "none")};
  border-radius: 2px;
  color: ${(props: PaymentBtnStyleProps) => (props.border ? colors.accent.CIVIL_GRAY_0 : colors.accent.CIVIL_GRAY_2)};
  cursor: pointer;
  display: flex;
  font-size: ${(props: PaymentBtnStyleProps) => (props.border ? "13px" : "12px")};
  font-weight: ${(props: PaymentBtnStyleProps) => (props.border ? "700" : "400")};
  justify-content: center;
  outline: none;
  padding: ${(props: PaymentBtnStyleProps) => (props.border ? "3px 8px" : "0")};
  transition: color 0.2s ease;

  svg {
    margin-right: 2px;

    path {
      fill: ${colors.accent.CIVIL_GRAY_0};
      transition: fill 0.2s ease;
    }
  }

  &:hover {
    color: ${colors.accent.CIVIL_BLUE};

    svg path {
      fill: ${colors.accent.CIVIL_BLUE};
    }
  }
`;

export interface PaymentButtonProps {
  border?: boolean;
  label?: string;
  onClick(ev: any): void;
}

export const PaymentButton: React.FunctionComponent<PaymentButtonProps> = props => {
  return (
    <PaymentBtnStyled onClick={props.onClick} border={props.border}>
      <TipIcon />
      {props.label || "Boost"}
    </PaymentBtnStyled>
  );
};
