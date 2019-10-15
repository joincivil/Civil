import * as React from "react";
import { CivilIcon } from "../icons";
import { YourTipText } from "./PaymentsTextComponents";
import {
  PaymentWrapperStyled,
  PaymentHeader,
  PaymentBackBtn,
  PaymentAmountWrapper,
  PaymentAmount,
} from "./PaymentsStyledComponents";

export interface PaymentsWrapperProps {
  showBackBtn: boolean;
  usdToSpend: number;
  children: any;
  handleBack?(): void;
}

export const PaymentsWrapper: React.FunctionComponent<PaymentsWrapperProps> = props => {
  return (
    <PaymentWrapperStyled>
      <PaymentHeader>
        {props.showBackBtn && <PaymentBackBtn onClick={props.handleBack}>Back</PaymentBackBtn>}
        <CivilIcon width={50} height={13} />
        <PaymentAmountWrapper>
          <YourTipText />
          <PaymentAmount>{"$" + props.usdToSpend}</PaymentAmount>
        </PaymentAmountWrapper>
      </PaymentHeader>
      {props.children}
    </PaymentWrapperStyled>
  );
};
