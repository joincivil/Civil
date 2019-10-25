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

    console.log("paymment request: ", paymentRequest);

    // paymentRequest.on("token", (token: any, complete: any, payerName: string, payerEmail: string) => {
    //   console.log("on token!.");
    //   if (!payerName) {
    //     console.log("bad payer name!.");
    //     complete("invalid_payer_name");
    //   } else if (!payerEmail) {
    //     console.log("bad payer email!.");
    //     complete("invalid_payer_email");
    //   } else {
    //     console.log("go handlePaymentRequest.");
    //     // tslint:disable-next-line
    //     this.handlePaymentRequest(token, complete);
    //   }
    // });

    paymentRequest.on("token", async (ev: any) => {
      console.log("onToken. ev: ", ev);
      return this.handlePaymentRequest(ev.token, ev.complete)
    })

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

  private async handlePaymentRequest(token: any, complete: any): Promise<void> {
    try {
      await this.props.savePayment({
        variables: {
          postID: this.props.boostId,
          input: {
            // @ts-ignore
            paymentToken: token.token.id,
            amount: this.props.usdToSpend,
            currencyCode: "usd",
          },
        },
      });
      complete("success");
    } catch (err) {
      console.error(err);
      complete("fail");
    }
  }
}

export default injectStripe(PaymentRequestForm);
