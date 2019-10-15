import * as React from "react";
import { PaymentDirectionsStyled, PaymentOptionDescription, PaymentBtn } from "./PaymentsStyledComponents";
import {
  SelectTipMethodText,
  PayWithCardText,
  PayWithCardMinimumText,
  PayWithCardDescriptionText,
  PayWithEthText,
  PayWithEthDescriptionText,
} from "./PaymentsTextComponents";
import { PAYMENT_STATE } from "./types";

export interface PaymentsOptionsProps {
  usdToSpend: number;
  isStripeConnected: boolean;
  handleNext(paymentState: PAYMENT_STATE): void;
}

export const PaymentsOptions: React.FunctionComponent<PaymentsOptionsProps> = props => {
  return (
    <>
      <PaymentDirectionsStyled>
        <SelectTipMethodText />
      </PaymentDirectionsStyled>
      {props.isStripeConnected && props.usdToSpend < 2 && (
        <PaymentOptionDescription warning={true}>
          <PayWithCardMinimumText />
        </PaymentOptionDescription>
      )}
      {props.isStripeConnected && (
        <>
          <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.STRIPE_PAYMENT)}>
            <PayWithCardText />
          </PaymentBtn>
          <PaymentOptionDescription>
            <PayWithCardDescriptionText />
          </PaymentOptionDescription>
        </>
      )}
      <>
        <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.ETH_PAYMENT)}>
          <PayWithEthText />
        </PaymentBtn>
        <PaymentOptionDescription>
          <PayWithEthDescriptionText />
        </PaymentOptionDescription>
      </>
    </>
  );
};
