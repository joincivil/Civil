import * as React from "react";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { PaymentsAmount } from "./PaymentsAmount";
import { EthAddress } from "@joincivil/core";
import { CivilContext, ICivilContext } from "../";
import { SuggestedPaymentAmounts, PAYMENT_STATE } from "./types";

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
  hideUserName: boolean;
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
      hideUserName: false,
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
    const { isWalletConnected, userAddress, usdToSpend, hideUserName, paymentState } = this.state;
    const { postId, paymentAddress, newsroomName, isStripeConnected } = this.props;

    if (paymentState === PAYMENT_STATE.SELECT_PAYMENT_TYPE) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          showBackBtn={true}
          backState={PAYMENT_STATE.SELECT_AMOUNT}
          handleBack={this.handleNavigate}
        >
          <PaymentsOptions isStripeConnected={isStripeConnected} handleNext={this.handleNavigate} />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.ETH_PAYMENT) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          showBackBtn={true}
          backState={PAYMENT_STATE.SELECT_PAYMENT_TYPE}
          handleBack={this.handleNavigate}
        >
          <PaymentsEth
            postId={postId}
            newsroomName={newsroomName}
            paymentAddress={paymentAddress}
            userAddress={userAddress}
            usdToSpend={usdToSpend}
            isWalletConnected={isWalletConnected}
            handlePaymentSuccess={this.handleNavigate}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.STRIPE_PAYMENT) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          showBackBtn={true}
          backState={PAYMENT_STATE.SELECT_PAYMENT_TYPE}
          handleBack={this.handleNavigate}
        >
          <PaymentsStripe
            postId={postId}
            newsroomName={newsroomName}
            usdToSpend={usdToSpend}
            handlePaymentSuccess={this.handleNavigate}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.PAYMENT_SUCCESS) {
      return <>Payment Successful!</>;
    }

    return (
      <PaymentsWrapper
        usdToSpend={usdToSpend}
        showBackBtn={false}
        backState={PAYMENT_STATE.SELECT_AMOUNT}
        handleBack={this.handleNavigate}
      >
        <PaymentsAmount
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          suggestedAmounts={SuggestedPaymentAmounts}
          handleAmount={this.handleAmount}
        />
      </PaymentsWrapper>
    );
  }

  private handleNavigate = (paymentState: PAYMENT_STATE) => {
    this.setState({ paymentState });
  };

  private handleAmount = (usdToSpend: number, hideUserName: boolean) => {
    this.setState({ usdToSpend, paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE, hideUserName });
  };
}
