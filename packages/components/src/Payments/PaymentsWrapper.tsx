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
  PaymentUpdatedByEthText,
  PayWithCardAdjustedText,
} from "./PaymentsTextComponents";

export interface PaymentsWrapperProps {
  newsroomName: string;
  usdToSpend?: number;
  etherToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjustedEth?: boolean;
  paymentAdjustedStripe?: boolean;
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
              <PaymentHeaderBoostLabel>
                {props.paymentAdjustedEth || props.paymentAdjustedStripe ? "Selected Boost" : "Boost"}
              </PaymentHeaderBoostLabel>
              <PaymentHeaderAmount>
                {props.paymentAdjustedEth || props.paymentAdjustedStripe ? (
                  "$" + props.selectedUsdToSpend
                ) : (
                  <b>{"$" + props.usdToSpend}</b>
                )}
              </PaymentHeaderAmount>
            </div>
          )}
        </PaymentHeaderFlex>
        <PaymentHeaderTip>
          <PaymentToNewsroomsTipText />
        </PaymentHeaderTip>
      </PaymentHeader>
      {props.paymentAdjustedStripe && (
        <PaymentAdjustedNotice>
          <PayWithCardMinimumText />
          <PaymentAdjustedNoticeFtr>
            <PayWithCardAdjustedText />
          </PaymentAdjustedNoticeFtr>
        </PaymentAdjustedNotice>
      )}
      {props.paymentAdjustedEth && (
        <PaymentAdjustedNotice>
          <PaymentUpdatedByEthText usdToSpend={props.usdToSpend} etherToSpend={props.etherToSpend} />
          <PaymentAdjustedNoticeFtr>
            <PayWithCardAdjustedText />
          </PaymentAdjustedNoticeFtr>
        </PaymentAdjustedNotice>
      )}
      {props.children}
    </PaymentWrapperStyled>
  );
};
