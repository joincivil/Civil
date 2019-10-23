import * as React from "react";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsLogin } from "./PaymentsLogin";
import { EthAddress } from "@joincivil/core";
import { SuggestedPaymentAmounts, PAYMENT_STATE } from "./types";
import { PaymentSuccessText } from "./PaymentsTextComponents";

export interface PaymentsProps {
  isLoggedIn: boolean;
  postId: string;
  paymentAddress: string;
  newsroomName: string;
  isStripeConnected: boolean;
  userAddress?: EthAddress;
  handleLogin(): void;
}

export interface PaymentsStates {
  usdToSpend: number;
  shouldPublicize: boolean;
  paymentState: PAYMENT_STATE;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      usdToSpend: 0,
      shouldPublicize: false,
      paymentState: PAYMENT_STATE.SELECT_AMOUNT,
    };
  }

  public render(): JSX.Element {
    const { usdToSpend, shouldPublicize, paymentState } = this.state;
    const { postId, paymentAddress, newsroomName, isStripeConnected, userAddress } = this.props;
    const isWalletConnected = userAddress ? true : false;

    if (paymentState === PAYMENT_STATE.PAYMENT_LOGIN) {
      return <PaymentsLogin handleNext={this.handleUpdateState} handleLogin={this.props.handleLogin} />;
    }

    if (paymentState === PAYMENT_STATE.SELECT_PAYMENT_TYPE) {
      return (
        <PaymentsWrapper usdToSpend={usdToSpend} newsroomName={newsroomName}>
          <PaymentsOptions
            usdToSpend={usdToSpend}
            isStripeConnected={isStripeConnected}
            handleNext={this.handleUpdateState}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.ETH_PAYMENT) {
      return (
        <PaymentsWrapper usdToSpend={usdToSpend} newsroomName={newsroomName}>
          <PaymentsEth
            postId={postId}
            newsroomName={newsroomName}
            paymentAddress={paymentAddress}
            shouldPublicize={shouldPublicize}
            userAddress={userAddress}
            usdToSpend={usdToSpend}
            isWalletConnected={isWalletConnected}
            handlePaymentSuccess={this.handleUpdateState}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.STRIPE_PAYMENT) {
      return (
        <PaymentsWrapper usdToSpend={usdToSpend} newsroomName={newsroomName}>
          <PaymentsStripe
            postId={postId}
            newsroomName={newsroomName}
            shouldPublicize={shouldPublicize}
            usdToSpend={usdToSpend}
            handlePaymentSuccess={this.handleUpdateState}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.PAYMENT_SUCCESS) {
      return <PaymentSuccessText newsroomName={this.props.newsroomName} usdToSpend={this.state.usdToSpend} />;
    }

    return (
      <PaymentsWrapper newsroomName={newsroomName}>
        <PaymentsAmount
          newsroomName={newsroomName}
          suggestedAmounts={SuggestedPaymentAmounts}
          handleAmount={this.handleAmount}
        />
      </PaymentsWrapper>
    );
  }

  private handleUpdateState = (paymentState: PAYMENT_STATE) => {
    if (paymentState === PAYMENT_STATE.STRIPE_PAYMENT && this.state.usdToSpend < 2) {
      this.setState({ paymentState, usdToSpend: 2 });
    } else {
      this.setState({ paymentState });
    }
  };

  private handleAmount = (usdToSpend: number, shouldPublicize: boolean) => {
    if (this.props.isLoggedIn) {
      this.setState({ usdToSpend, paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE, shouldPublicize });
    } else {
      this.setState({ usdToSpend, paymentState: PAYMENT_STATE.PAYMENT_LOGIN, shouldPublicize });
    }
  };
}
