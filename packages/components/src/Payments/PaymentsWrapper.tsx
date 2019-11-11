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
  PayWithCardMinimumAdjustedText,
  PaymentUpdatedByEthText,
  PayWithCardAdjustedText,
  PaymentEditText,
} from "./PaymentsTextComponents";
import { PAYMENT_STATE } from "./types";

export interface PaymentsWrapperProps {
  newsroomName: string;
  usdToSpend?: number;
  etherToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjustedWarning?: boolean;
  paymentAdjustedEth?: boolean;
  paymentAdjustedStripe?: boolean;
  children: any;
  handleEditPaymentType?(paymentState: PAYMENT_STATE): void;
  handleEditAmount?(paymentState: PAYMENT_STATE): void;
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
                {props.paymentAdjustedWarning || props.paymentAdjustedEth || props.paymentAdjustedStripe
                  ? "Selected Boost"
                  : "Boost"}
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
      {props.paymentAdjustedWarning && props.handleEditAmount && (
        <PaymentAdjustedNotice>
          <PayWithCardMinimumText handleEditAmount={props.handleEditAmount} />
        </PaymentAdjustedNotice>
      )}
      {props.paymentAdjustedStripe && (
        <PaymentAdjustedNotice>
          <PayWithCardMinimumAdjustedText />
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
      {props.handleEditPaymentType && <PaymentEditText handleEditPaymentType={props.handleEditPaymentType} />}
      {props.children}
    </PaymentWrapperStyled>
  );
};
