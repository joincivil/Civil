import * as React from "react";
import { PaymentOptionDescription, PaymentBtn } from "./PaymentsStyledComponents";
import {
  SelectTipMethodText,
  PayWithCardText,
  PayWithCardDescriptionText,
  PayWithEthText,
  PayWithEthDescriptionText,
} from "./PaymentsTextComponents";

export interface PaymentOptionsProps {
  amount: string;
  newsroomMultisig: string;
  newsroomName: string;
  isStripeConnected?: boolean;
  walletConnected?: boolean;
}

export const PaymentOptions: React.FunctionComponent<PaymentOptionsProps> = props => {
  return (
    <>
      <>
        <SelectTipMethodText />
      </>
      {props.isStripeConnected && (
        <>
          <PaymentBtn>
            <PayWithCardText />
          </PaymentBtn>
          <PaymentOptionDescription>
            <PayWithCardDescriptionText />
          </PaymentOptionDescription>
        </>
      )}
      <>
        <PaymentBtn>
          <PayWithEthText />
        </PaymentBtn>
        <PaymentOptionDescription>
          <PayWithEthDescriptionText />
        </PaymentOptionDescription>
      </>
    </>
  );
};
