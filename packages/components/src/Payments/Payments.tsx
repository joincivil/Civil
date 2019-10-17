import * as React from "react";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { PaymentsAmount } from "./PaymentsAmount";
import { EthAddress } from "@joincivil/core";
import { CivilContext, ICivilContext } from "../";
import { SuggestedPaymentAmounts, PAYMENT_STATE } from "./types";
import { PaymentSuccessText } from "./PaymentsTextComponents";

export interface PaymentsProps {
  postId: string;
  paymentAddress: string;
  newsroomName: string;
  isStripeConnected: boolean;
}

export interface PaymentsStates {
  isWalletConnected: boolean;
  userAddress?: EthAddress;
  usdToSpend: number;
  shouldPublicize: boolean;
  paymentState: PAYMENT_STATE;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = {
      isWalletConnected: false,
      usdToSpend: 0,
      shouldPublicize: false,
      paymentState: PAYMENT_STATE.SELECT_AMOUNT,
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
    const { isWalletConnected, userAddress, usdToSpend, shouldPublicize, paymentState } = this.state;
    const { postId, paymentAddress, newsroomName, isStripeConnected } = this.props;

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
    this.setState({ usdToSpend, paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE, shouldPublicize });
  };
}
