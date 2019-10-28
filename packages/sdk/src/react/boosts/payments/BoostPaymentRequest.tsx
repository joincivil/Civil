import * as React from "react";
import { MutationFunc } from "react-apollo";
import { injectStripe, ReactStripeElements, PaymentRequestButtonElement } from "react-stripe-elements";
import styled from "styled-components";
import { colors } from "@joincivil/components";

const StripePaymentRequest = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_2};
  margin-bottom: 10px;
  padding: 10px 0;
`;

export interface BoostPaymentRequestProps extends ReactStripeElements.InjectedStripeProps {
  savePayment: MutationFunc;
  boostId: string;
  usdToSpend: number;
  onPayRequestSuccess?(): void;
  onPayRequestError?(): void;
}

export interface BoostPaymentRequestStates {
  canMakePayment: boolean;
  paymentRequest: any;
}

class PaymentRequestForm extends React.Component<BoostPaymentRequestProps, BoostPaymentRequestStates> {
  constructor(props: any) {
    super(props);

    const paymentRequest = props.stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: "Civil Boost",
        amount: this.props.usdToSpend * 100,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequest.on("token", async (ev: any) => {
      if (ev && ev.token && ev.complete && ev.payerEmail) {
        return this.handlePaymentRequest(ev.token, ev.complete, ev.payerEmail);
      } else {
        console.error("Error processing Payment Request");
        if (this.props.onPayRequestError) {
          this.props.onPayRequestError();
        }
      }
    });

    paymentRequest.canMakePayment().then((result: any) => {
      this.setState({ canMakePayment: !!result });
    });

    this.state = {
      canMakePayment: false,
      paymentRequest,
    };
  }

  public render(): JSX.Element {
    return this.state.canMakePayment ? (
      <StripePaymentRequest>
        <PaymentRequestButtonElement paymentRequest={this.state.paymentRequest} className="PaymentRequestButton" />
      </StripePaymentRequest>
    ) : (
      <></>
    );
  }

  private async handlePaymentRequest(token: any, complete: any, email: string): Promise<void> {
    try {
      await this.props.savePayment({
        variables: {
          postID: this.props.boostId,
          input: {
            // @ts-ignore
            paymentToken: token.id,
            amount: this.props.usdToSpend,
            currencyCode: "usd",
            emailAddress: email,
          },
        },
      });
      complete("success");
      if (this.props.onPayRequestSuccess) {
        this.props.onPayRequestSuccess();
      }
    } catch (err) {
      console.error(err);
      complete("fail");
      if (this.props.onPayRequestError) {
        this.props.onPayRequestError();
      }
    }
  }
}

export default injectStripe(PaymentRequestForm);
