import * as React from "react";
import { PayWithGoogleText, PaymentStripeNoticeText, PaymentTermsText } from "./PaymentsTextComponents";
import { PaymentTerms } from "./PaymentsStyledComponents";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";

export interface PaymentsGooglePayProps {
  newsroomName: string;
  usdToSpend: number;
  handleEditPaymentType(): void;
}

export const PaymentsGooglePay: React.FunctionComponent<PaymentsGooglePayProps> = props => {
  return (
    <>
      <PaymentsFormWrapper
        handleEditPaymentType={props.handleEditPaymentType}
        payWithText={<PayWithGoogleText />}
        paymentNoticeText={<PaymentStripeNoticeText />}
      />
      {/* Google Pay TKTK */}
      <PaymentTerms>
        <PaymentTermsText />
      </PaymentTerms>
    </>
  );
};
