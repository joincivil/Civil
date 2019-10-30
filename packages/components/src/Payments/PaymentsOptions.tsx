import * as React from "react";
// import PaymentRequestForm from "./PaymentsRequest";
import {
  PaymentDirectionsStyled,
  PaymentOptionDescription,
  PaymentBtn,
  PaymentInfoStyled,
} from "./PaymentsStyledComponents";
import {
  SelectPaymentMethodText,
  PayWithCardText,
  PayWithCardMinimumText,
  PayWithEthText,
  PaymentInfoText,
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
        <SelectPaymentMethodText />
      </PaymentDirectionsStyled>
      {/*
      <PaymentRequestForm
        savePayment={props.savePayment}
        boostId={props.postId}
        usdToSpend={props.usdToSpend}
        handlePaymentSuccess={props.handlePaymentSuccess}
      />
      */}
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
        </>
      )}
      <>
        <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.ETH_PAYMENT)}>
          <PayWithEthText />
        </PaymentBtn>
      </>
      <PaymentInfoStyled>
        <PaymentInfoText />
      </PaymentInfoStyled>
    </>
  );
};
