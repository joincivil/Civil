import * as React from "react";
import {
  PaymentWrapperStyled,
  PaymentHeader,
  PaymentHeaderFlex,
  PaymentHeaderNewsroom,
  PaymentHeaderBoostLabel,
  PaymentHeaderAmount,
  PaymentHeaderTip,
} from "./PaymentsStyledComponents";
import { SendPaymentHdrText, PaymentToNewsroomsTipText } from "./PaymentsTextComponents";

export interface PaymentsWrapperProps {
  newsroomName: string;
  usdToSpend?: number;
  children: any;
}

export const PaymentsWrapper: React.FunctionComponent<PaymentsWrapperProps> = props => {
  return (
    <PaymentWrapperStyled>
      <PaymentHeader>
        <h2>
          <SendPaymentHdrText />
        </h2>
        <PaymentHeaderFlex>
          <PaymentHeaderNewsroom>{props.newsroomName}</PaymentHeaderNewsroom>
          {props.usdToSpend && (
            <div>
              <PaymentHeaderBoostLabel>Boost</PaymentHeaderBoostLabel>
              <PaymentHeaderAmount>{"$" + props.usdToSpend}</PaymentHeaderAmount>
            </div>
          )}
        </PaymentHeaderFlex>
        <PaymentHeaderTip>
          <PaymentToNewsroomsTipText />
        </PaymentHeaderTip>
      </PaymentHeader>
      {props.children}
    </PaymentWrapperStyled>
  );
};
