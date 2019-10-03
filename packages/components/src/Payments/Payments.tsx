import * as React from "react";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { EthAddress } from "@joincivil/core";
import { CivilContext, ICivilContext } from "../";

export interface PaymentsProps {
  postId: string;
  usdToSpend: number;
  paymentAddress: string;
  newsroomName: string;
  isStripeConnected: boolean;
}

export interface PaymentsStates {
  isWalletConnected: boolean;
  userAddress?: EthAddress;
  payEth: boolean;
  payStripe: boolean;
  isPaymentSuccessfull: boolean;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = {
      isWalletConnected: false,
      payEth: false,
      payStripe: false,
      isPaymentSuccessfull: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    const civil = this.context.civil;
    if (civil) {
      const account = await civil.accountStream.first().toPromise();
      this.setState({ userAddress: account, isWalletConnected: true });
    }
  }

  public render(): JSX.Element {
    if (this.state.payEth) {
      return (
        <PaymentsWrapper usdToSpend={this.props.usdToSpend} showBackBtn={true} handleBack={this.handleBack}>
          <PaymentsEth
            postId={this.props.postId}
            newsroomName={this.props.newsroomName}
            paymentAddress={this.props.paymentAddress}
            userAddress={this.state.userAddress}
            usdToSpend={this.props.usdToSpend}
            isWalletConnected={this.state.isWalletConnected}
            handlePaymentSuccess={this.handlePaymentSuccess}
          />
        </PaymentsWrapper>
      );
    }

    if (this.state.payStripe) {
      return (
        <PaymentsWrapper usdToSpend={this.props.usdToSpend} showBackBtn={true} handleBack={this.handleBack}>
          <PaymentsStripe
            postId={this.props.postId}
            newsroomName={this.props.newsroomName}
            usdToSpend={this.props.usdToSpend}
            handlePaymentSuccess={this.handlePaymentSuccess}
          />
        </PaymentsWrapper>
      );
    }
    if (this.state.isPaymentSuccessfull) {
      return <>Payment Successful!</>;
    }

    return (
      <PaymentsWrapper usdToSpend={this.props.usdToSpend} showBackBtn={false}>
        <PaymentsOptions
          isStripeConnected={this.props.isStripeConnected}
          handlePayEth={this.handlePayEth}
          handlePayStripe={this.handlePayStripe}
        />
      </PaymentsWrapper>
    );
  }

  private handleBack = () => {
    this.setState({ payEth: false, payStripe: false, isPaymentSuccessfull: false });
  };

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
