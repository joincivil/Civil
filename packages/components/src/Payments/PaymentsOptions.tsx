import * as React from "react";
// import PaymentRequestForm from "./PaymentsRequest";
import {
  PaymentDirectionsStyled,
  PaymentTypeSelect,
  PaymentBtn,
  PaymentInfoStyled,
  PayAppleGoogleOnCivilPrompt,
} from "./PaymentsStyledComponents";
import {
  SelectPaymentMethodText,
  PayWithCardText,
  PayWithEthText,
  PaymentInfoText,
  PayAppleGoogleOnCivilText,
} from "./PaymentsTextComponents";
import { PAYMENT_STATE } from "./types";
import { RENDER_CONTEXT } from "../context";

export interface PaymentsOptionsProps {
  postId: string;
  usdToSpend: number;
  isStripeConnected: boolean;
  renderContext: RENDER_CONTEXT;
  handleNext(paymentState: PAYMENT_STATE): void;
}

export const PaymentsOptions: React.FunctionComponent<PaymentsOptionsProps> = props => {
  return (
    <>
      <PaymentDirectionsStyled>
        <SelectPaymentMethodText />
      </PaymentDirectionsStyled>
      <PaymentTypeSelect>
        {props.renderContext === RENDER_CONTEXT.DAPP &&
          {
            /*
        <PaymentRequestForm
          savePayment={props.savePayment}
          boostId={props.postId}
          usdToSpend={props.usdToSpend}
          handlePaymentSuccess={props.handlePaymentSuccess}
        />
        */
          }}
        {props.isStripeConnected && (
          <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.STRIPE_PAYMENT)} backgroundColor={"#26CD41"}>
            <PayWithCardText />
          </PaymentBtn>
        )}
        <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.ETH_PAYMENT)}>
          <PayWithEthText />
        </PaymentBtn>
      </PaymentTypeSelect>
      {props.renderContext === RENDER_CONTEXT.DAPP && (
        <PaymentInfoStyled>
          <PaymentInfoText />
        </PaymentInfoStyled>
      )}
      {props.renderContext === RENDER_CONTEXT.EMBED && (
        <PayAppleGoogleOnCivilPrompt>
          <PayAppleGoogleOnCivilText postId={props.postId} />
        </PayAppleGoogleOnCivilPrompt>
      )}
    </>
  );
};
