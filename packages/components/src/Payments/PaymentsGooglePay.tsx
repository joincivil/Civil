import * as React from "react";
import { PayWithGoogleText, PaymentStripeNoticeText, PaymentTermsText } from "./PaymentsTextComponents";
import { PaymentTerms } from "./PaymentsStyledComponents";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";

export interface PaymentsGooglePayProps {
  newsroomName: string;
  usdToSpend: number;
}

export const PaymentsGooglePay: React.FunctionComponent<PaymentsGooglePayProps> = props => {
  return (
    <>
      <PaymentsFormWrapper payWithText={<PayWithGoogleText />} paymentNoticeText={<PaymentStripeNoticeText />} />
      {/* Google Pay TKTK */}
      <PaymentTerms>
        <PaymentTermsText />
      </PaymentTerms>
    </>
  );
};
