import * as React from "react";
import { PaymentOptionDescription, PaymentBtn } from "./PaymentsStyledComponents";
import {
  SelectTipMethodText,
  PayWithCardText,
  PayWithCardDescriptionText,
  PayWithEthText,
  PayWithEthDescriptionText,
} from "./PaymentsTextComponents";

export interface PaymentsOptionsProps {
  newsroomMultisig: string;
  newsroomName: string;
  isStripeConnected?: boolean;
  walletConnected?: boolean;
  handlePayEth(): void;
  handlePayStripe(): void;
}

export const PaymentsOptions: React.FunctionComponent<PaymentsOptionsProps> = props => {
  return (
    <>
      <>
        <SelectTipMethodText />
      </>
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
