import * as React from "react";
import { YourTipText } from "./PaymentsTextComponents";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";

export interface PaymentsProps {
  linkId: string;
  usdToSpend: number;
  newsroomMultisig: string;
  newsroomName: string;
  isStripeConnected?: boolean;
  walletConnected: boolean;
}

export interface PaymentsStates {
  payEth: boolean;
  payStripe: boolean;
  isPaymentSuccessfull: boolean;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      payEth: false,
      payStripe: false,
      isPaymentSuccessfull: false,
    };
  }

  public render(): JSX.Element {
    if (this.state.payEth) {
      return (
        <PaymentsEth
          linkId={this.props.linkId}
          newsroomName={this.props.newsroomName}
          paymentAddr={this.props.newsroomMultisig}
          usdToSpend={this.props.usdToSpend}
          walletConnected={this.props.walletConnected}
          handlePaymentSuccess={this.handlePaymentSuccess}
        />
      );
    }

    if (this.state.payStripe) {
      return (
        <PaymentsStripe
          linkId={this.props.linkId}
          newsroomName={this.props.newsroomName}
          usdToSpend={this.props.usdToSpend}
          handlePaymentSuccess={this.handlePaymentSuccess}
        />
      );
    }
    if (this.state.isPaymentSuccessfull) {
      return <>Payment Successful!</>;
    }

    return (
      <>
        <>
          <YourTipText /> {"$" + this.props.usdToSpend}
        </>
        <PaymentsOptions
          newsroomMultisig={this.props.newsroomMultisig}
          newsroomName={this.props.newsroomName}
          isStripeConnected={this.props.isStripeConnected}
          walletConnected={this.props.walletConnected}
          handlePayEth={this.handlePayEth}
          handlePayStripe={this.handlePayStripe}
        />
      </>
    );
  }

  private handlePayEth = () => {
    this.setState({ payEth: true, payStripe: false, isPaymentSuccessfull: false });
  };

  private handlePayStripe = () => {
    this.setState({ payStripe: true, payEth: false, isPaymentSuccessfull: false });
  };

  private handlePaymentSuccess = () => {
    this.setState({ isPaymentSuccessfull: true, payEth: false, payStripe: false });
  };
}
