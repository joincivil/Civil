import * as React from "react";
import { PaymentDirectionsStyled, PaymentOptionDescription, PaymentBtn } from "./PaymentsStyledComponents";
import {
  SelectTipMethodText,
  PayWithCardText,
  PayWithCardDescriptionText,
  PayWithEthText,
  PayWithEthDescriptionText,
} from "./PaymentsTextComponents";

export interface PaymentsOptionsProps {
  isStripeConnected: boolean;
  handlePayEth(): void;
  handlePayStripe(): void;
}

export const PaymentsOptions: React.FunctionComponent<PaymentsOptionsProps> = props => {
  return (
    <>
      <PaymentDirectionsStyled>
        <SelectTipMethodText />
      </PaymentDirectionsStyled>
      {props.isStripeConnected && (
        <>
          <PaymentBtn onClick={props.handlePayStripe}>
            <PayWithCardText />
          </PaymentBtn>
          <PaymentOptionDescription>
            <PayWithCardDescriptionText />
          </PaymentOptionDescription>
        </>
      )}
      <>
        <PaymentBtn onClick={props.handlePayEth}>
          <PayWithEthText />
        </PaymentBtn>
        <PaymentOptionDescription>
          <PayWithEthDescriptionText />
        </PaymentOptionDescription>
      </>
    </>
  );
};
