import * as React from "react";
import {
  PaymentDirectionsStyled,
  PaymentTypeSelect,
  PaymentBtn,
  PaymentInfoStyled,
  PayAppleGoogleOnCivilPrompt,
  PaymentAmountUserOptions,
} from "./PaymentsStyledComponents";
import {
  SelectPaymentMethodText,
  PayWithCardText,
  PayWithEthText,
  PaymentInfoText,
  PayAppleGoogleOnCivilText,
  PublicizeUserText,
} from "./PaymentsTextComponents";
import { PAYMENT_STATE } from "./types";
import { RENDER_CONTEXT, CivilContext, ICivilContext } from "../context";
import { PaymentsLoadStripePayRequest } from "./PaymentsLoadStripePayRequest";
import { Checkbox, CheckboxSizes } from "../input";

export interface PaymentsSelectTypeProps {
  postId: string;
  usdToSpend: number;
  newsroomName: string;
  shouldPublicize: boolean;
  isStripeConnected: boolean;
  handleShouldPublicize(shouldPublicize: boolean): void;
  handleNext(paymentState: PAYMENT_STATE): void;
  handlePaymentSuccess(): void;
}

export const PaymentsSelectType: React.FunctionComponent<PaymentsSelectTypeProps> = props => {
  const context = React.useContext<ICivilContext>(CivilContext);
  return (
    <>
      <PaymentDirectionsStyled>
        <SelectPaymentMethodText />
      </PaymentDirectionsStyled>
      <PaymentTypeSelect>
        {props.isStripeConnected && context.renderContext === RENDER_CONTEXT.DAPP && (
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
      <PaymentAmountUserOptions>
        <Checkbox
          id="shouldPublicize"
          size={CheckboxSizes.SMALL}
          checked={!props.shouldPublicize}
          onClick={() => props.handleShouldPublicize(!props.shouldPublicize)}
        />
        <label htmlFor="shouldPublicize">
          <PublicizeUserText />
        </label>
      </PaymentAmountUserOptions>
      {context.renderContext === RENDER_CONTEXT.DAPP && (
        <PaymentInfoStyled>
          <PaymentInfoText />
        </PaymentInfoStyled>
      )}
      {props.isStripeConnected && context.renderContext === RENDER_CONTEXT.EMBED && (
        <PayAppleGoogleOnCivilPrompt>
          <PayAppleGoogleOnCivilText postId={props.postId} />
        </PayAppleGoogleOnCivilPrompt>
      )}
    </>
  );
};
