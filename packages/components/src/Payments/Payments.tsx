import * as React from "react";
import { YourTipText } from "./PaymentsTextComponents";
import { PaymentOptions } from "./PaymentOptions";

export interface PaymentsProps {
  amount: string;
  newsroomMultisig: string;
  newsroomName: string;
  isStripeConnected?: boolean;
  walletConnected?: boolean;
}

export const Payments: React.FunctionComponent<PaymentsProps> = props => {
  return (
    <>
      <>
        <YourTipText /> {"$" + props.amount}
      </>
      <PaymentOptions
        amount={props.amount}
        newsroomMultisig={props.newsroomMultisig}
        newsroomName={props.newsroomName}
        isStripeConnected={props.isStripeConnected}
        walletConnected={props.walletConnected}
      />
    </>
  );
};
