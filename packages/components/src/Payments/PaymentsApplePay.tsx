import * as React from "react";
import { PayWithAppleText, PaymentStripeNoticeText, PaymentTermsText } from "./PaymentsTextComponents";
import { PaymentTerms } from "./PaymentsStyledComponents";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";

export interface PaymentsApplePayProps {
  newsroomName: string;
  usdToSpend: number;
  handleEditPaymentType(): void;
}

export const PaymentsApplePay: React.FunctionComponent<PaymentsApplePayProps> = props => {
  return (
    <>
      <PaymentsFormWrapper
        handleEditPaymentType={props.handleEditPaymentType}
        payWithText={<PayWithAppleText />}
        paymentNoticeText={<PaymentStripeNoticeText />}
      />
      {/* Apple Pay TKTK */}
      <PaymentTerms>
        <PaymentTermsText />
      </PaymentTerms>
    </>
  );
};
