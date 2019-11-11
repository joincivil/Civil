import * as React from "react";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsLoginOrGuest } from "./PaymentsLoginOrGuest";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsApplePay } from "./PaymentsApplePay";
import { PaymentsGooglePay } from "./PaymentsGooglePay";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { EthAddress } from "@joincivil/core";
import { SuggestedPaymentAmounts, PAYMENT_STATE } from "./types";
import { PaymentsSuccess } from "./PaymentsSuccess";

export interface PaymentsProps {
  isLoggedIn: boolean;
  postId: string;
  paymentAddress: string;
  newsroomName: string;
  isStripeConnected: boolean;
  userAddress?: EthAddress;
  userEmail?: string;
  handleLogin(): void;
  handleClose(): void;
}

export interface PaymentsStates {
  usdToSpend: number;
  etherToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjustedWarning: boolean;
  paymentAdjustedStripe: boolean;
  paymentAdjustedEth: boolean;
  shouldPublicize: boolean;
  paymentState: PAYMENT_STATE;
  resetEthPayments: boolean;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      usdToSpend: 0,
      paymentAdjustedWarning: false,
      paymentAdjustedStripe: false,
      paymentAdjustedEth: false,
      shouldPublicize: false,
      paymentState: PAYMENT_STATE.SELECT_AMOUNT,
      resetEthPayments: false,
    };
  }

  public render(): JSX.Element {
    const {
      usdToSpend,
      etherToSpend,
      shouldPublicize,
      paymentState,
      selectedUsdToSpend,
      paymentAdjustedWarning,
      paymentAdjustedStripe,
      paymentAdjustedEth,
    } = this.state;
    const { postId, paymentAddress, newsroomName, isStripeConnected, userAddress, userEmail } = this.props;
    const isWalletConnected = userAddress ? true : false;

    if (paymentState === PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST) {
      return <PaymentsLoginOrGuest handleNext={this.handleUpdateState} handleLogin={this.props.handleLogin} />;
    }

    if (paymentState === PAYMENT_STATE.SELECT_PAYMENT_TYPE) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          paymentAdjustedWarning={paymentAdjustedWarning}
          handleEditAmount={this.handleUpdateState}
        >
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
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          paymentAdjustedEth={paymentAdjustedEth}
          selectedUsdToSpend={selectedUsdToSpend}
          etherToSpend={etherToSpend}
          handleEditPaymentType={this.handleUpdateState}
        >
          <PaymentsEth
            postId={postId}
            newsroomName={newsroomName}
            paymentAddress={paymentAddress}
            shouldPublicize={shouldPublicize}
            userAddress={userAddress}
            userEmail={userEmail}
            usdToSpend={usdToSpend}
            isWalletConnected={isWalletConnected}
            handlePaymentSuccess={this.handleUpdateState}
            etherToSpend={this.state.etherToSpend}
            resetEthPayments={this.state.resetEthPayments}
            handleBoostUpdate={this.handleUpdateBoostFromEth}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.STRIPE_PAYMENT) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          paymentAdjustedStripe={paymentAdjustedStripe}
          selectedUsdToSpend={selectedUsdToSpend}
          handleEditPaymentType={this.handleUpdateState}
        >
          <PaymentsStripe
            postId={postId}
            newsroomName={newsroomName}
            shouldPublicize={shouldPublicize}
            userEmail={userEmail}
            usdToSpend={usdToSpend}
            handlePaymentSuccess={this.handleUpdateState}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.APPLE_PAY) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          handleEditPaymentType={this.handleUpdateState}
        >
          <PaymentsApplePay newsroomName={newsroomName} usdToSpend={usdToSpend} />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.GOOGLE_PAY) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          handleEditPaymentType={this.handleUpdateState}
        >
          <PaymentsGooglePay newsroomName={newsroomName} usdToSpend={usdToSpend} />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.PAYMENT_SUCCESS) {
      return (
        <PaymentsWrapper newsroomName={newsroomName}>
          <PaymentsSuccess newsroomName={newsroomName} usdToSpend={usdToSpend} handleClose={this.props.handleClose} />
        </PaymentsWrapper>
      );
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
      this.setState({
        paymentState,
        usdToSpend: 2,
        selectedUsdToSpend: this.state.usdToSpend,
        paymentAdjustedStripe: true,
        paymentAdjustedEth: true,
      });
    } else {
      this.setState({ paymentState, paymentAdjustedStripe: false, paymentAdjustedEth: false });
    }
  };

  private handleAmount = (usdToSpend: number, shouldPublicize: boolean) => {
    const paymentAdjustedWarning = usdToSpend < 2 ? true : false;
    if (this.props.isLoggedIn) {
      this.setState({
        usdToSpend,
        paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE,
        shouldPublicize,
        paymentAdjustedWarning,
      });
    } else {
      this.setState({
        usdToSpend,
        paymentState: PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST,
        shouldPublicize,
        paymentAdjustedWarning,
      });
    }
  };

  private handleUpdateBoostFromEth = (newUsdToSpend: number, selectedUsdToSpend: number, etherToSpend: number) => {
    this.setState({
      usdToSpend: newUsdToSpend,
      selectedUsdToSpend,
      etherToSpend,
      paymentAdjustedEth: true,
      paymentAdjustedStripe: false,
      resetEthPayments: true,
    });
  };
}
