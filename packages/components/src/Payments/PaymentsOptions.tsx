import * as React from "react";
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
import { RENDER_CONTEXT, CivilContext, ICivilContext } from "../context";
import { PaymentsLoadStripePayRequest } from "./PaymentsLoadStripePayRequest";

export interface PaymentsOptionsProps {
  postId: string;
  usdToSpend: number;
  newsroomName: string;
  shouldPublicize: boolean;
  isStripeConnected: boolean;
  handleNext(paymentState: PAYMENT_STATE): void;
  handlePaymentSuccess(): void;
}

export const PaymentsOptions: React.FunctionComponent<PaymentsOptionsProps> = props => {
  const context = React.useContext<ICivilContext>(CivilContext);
  return (
    <>
      <PaymentDirectionsStyled>
        <SelectPaymentMethodText />
      </PaymentDirectionsStyled>
      <PaymentTypeSelect>
        {context.renderContext === RENDER_CONTEXT.DAPP && (
          <PaymentsLoadStripePayRequest
            postId={props.postId}
            newsroomName={props.newsroomName}
            shouldPublicize={props.shouldPublicize}
            usdToSpend={props.usdToSpend}
            handlePaymentSuccess={props.handlePaymentSuccess}
          />
        )}
        {props.isStripeConnected && (
          <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.STRIPE_PAYMENT)} backgroundColor={"#26CD41"}>
            <PayWithCardText />
          </PaymentBtn>
        )}
        <PaymentBtn onClick={() => props.handleNext(PAYMENT_STATE.ETH_PAYMENT)}>
          <PayWithEthText />
        </PaymentBtn>
      </PaymentTypeSelect>
      {context.renderContext === RENDER_CONTEXT.DAPP && (
        <PaymentInfoStyled>
          <PaymentInfoText />
        </PaymentInfoStyled>
      )}
      {context.renderContext === RENDER_CONTEXT.EMBED && (
        <PayAppleGoogleOnCivilPrompt>
          <PayAppleGoogleOnCivilText postId={props.postId} />
        </PayAppleGoogleOnCivilPrompt>
      )}
    </>
  );
};
