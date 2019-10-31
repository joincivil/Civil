import * as React from "react";
// import PaymentRequestForm from "./PaymentsRequest";
import { PaymentDirectionsStyled, PaymentTypeSelect, PaymentBtn, PaymentInfoStyled } from "./PaymentsStyledComponents";
import { SelectPaymentMethodText, PayWithCardText, PayWithEthText, PaymentInfoText } from "./PaymentsTextComponents";
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
      <PaymentTypeSelect>
        {/*
        <PaymentRequestForm
          savePayment={props.savePayment}
          boostId={props.postId}
          usdToSpend={props.usdToSpend}
          handlePaymentSuccess={props.handlePaymentSuccess}
        />
        */}
        {props.isStripeConnected && (
          <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.STRIPE_PAYMENT)} backgroundColor={"#26CD41"}>
            <PayWithCardText />
          </PaymentBtn>
        )}
        <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.ETH_PAYMENT)}>
          <PayWithEthText />
        </PaymentBtn>
      </PaymentTypeSelect>
      <PaymentInfoStyled>
        <PaymentInfoText />
      </PaymentInfoStyled>
    </>
  );
};
