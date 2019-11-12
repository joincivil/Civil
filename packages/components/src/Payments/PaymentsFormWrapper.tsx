import * as React from "react";
import { SecureLockIcon } from "@joincivil/elements";
import {
  PaymentFormWrapperStyled,
  PaymentInfoFlex,
  PaymentTypeLabel,
  PaymentSecure,
  PaymentNotice,
} from "./PaymentsStyledComponents";
import { PaymentEditText } from "./PaymentsTextComponents";

export interface PaymentsFormWrapperProps {
  payWithText: string | JSX.Element;
  paymentNoticeText: string | JSX.Element;
  showSecureIcon?: boolean;
  children?: any;
  handleEditPaymentType(): void;
}

export const PaymentsFormWrapper: React.FunctionComponent<PaymentsFormWrapperProps> = props => {
  return (
    <>
      <PaymentEditText handleEditPaymentType={props.handleEditPaymentType} />
      <PaymentFormWrapperStyled>
        <PaymentInfoFlex>
          <PaymentTypeLabel>{props.payWithText}</PaymentTypeLabel>
          {props.showSecureIcon && (
            <PaymentSecure>
              Secure transaction <SecureLockIcon />
            </PaymentSecure>
          )}
        </PaymentInfoFlex>
        <PaymentNotice>{props.paymentNoticeText}</PaymentNotice>
        {props.children}
      </PaymentFormWrapperStyled>
    </>
  );
};
