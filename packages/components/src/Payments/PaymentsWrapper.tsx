import * as React from "react";
import {
  PaymentWrapperStyled,
  PaymentHeader,
  PaymentHeaderFlex,
  PaymentHeaderNewsroom,
  PaymentHeaderBoostLabel,
  PaymentHeaderAmount,
  PaymentHeaderTip,
  PaymentAdjustedNotice,
  PaymentAdjustedNoticeFtr,
} from "./PaymentsStyledComponents";
import {
  SendPaymentHdrText,
  PaymentToNewsroomsTipText,
  PayWithCardMinimumText,
  PayWithCardAdjustedText,
} from "./PaymentsTextComponents";

export interface PaymentsWrapperProps {
  newsroomName: string;
  usdToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjusted?: boolean;
  children: any;
}

export const PaymentsWrapper: React.FunctionComponent<PaymentsWrapperProps> = props => {
  return (
    <PaymentWrapperStyled>
      <PaymentHeader>
        <SendPaymentHdrText />
        <PaymentHeaderFlex>
          <PaymentHeaderNewsroom>{props.newsroomName}</PaymentHeaderNewsroom>
          {props.usdToSpend && (
            <div>
              <PaymentHeaderBoostLabel>{props.paymentAdjusted ? "Selected Boost" : "Boost"}</PaymentHeaderBoostLabel>
              <PaymentHeaderAmount>
                ${props.paymentAdjusted ? props.selectedUsdToSpend : <b>{props.usdToSpend}</b>}
              </PaymentHeaderAmount>
            </div>
          )}
        </PaymentHeaderFlex>
        <PaymentHeaderTip>
          <PaymentToNewsroomsTipText />
        </PaymentHeaderTip>
      </PaymentHeader>
      {props.paymentAdjusted && (
        <PaymentAdjustedNotice>
          <PayWithCardMinimumText />
          <PaymentAdjustedNoticeFtr>
            <PayWithCardAdjustedText />
          </PaymentAdjustedNoticeFtr>
        </PaymentAdjustedNotice>
      )}
      {props.children}
    </PaymentWrapperStyled>
  );
};
