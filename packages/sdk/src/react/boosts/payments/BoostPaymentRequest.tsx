import * as React from "react";
import { MutationFunc } from "react-apollo";
import { injectStripe, ReactStripeElements, PaymentRequestButtonElement } from "react-stripe-elements";

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
        label: "Boost",
        amount: this.props.usdToSpend,
      },
    });

    paymentRequest.on("token", (token: any) => {
      this.handlePaymentRequest(token);
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
      <PaymentRequestButtonElement paymentRequest={this.state.paymentRequest} className="PaymentRequestButton" />
    ) : (
      <></>
    );
  }

  private async handlePaymentRequest(token: any): Promise<void> {
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
  };
}

export default injectStripe(PaymentRequestForm);
