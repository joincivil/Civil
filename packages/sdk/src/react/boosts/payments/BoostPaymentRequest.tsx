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
        amount: this.props.usdToSpend,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    paymentRequest.on("token", (token: any) => {
      // tslint:disable-next-line
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
      <StripePaymentRequest>
        <PaymentRequestButtonElement paymentRequest={this.state.paymentRequest} className="PaymentRequestButton" />
      </StripePaymentRequest>
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
  }
}

export default injectStripe(PaymentRequestForm);