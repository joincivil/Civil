import * as React from "react";
import { ICivilContext, CivilContext } from "../context";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsLoginOrGuest } from "./PaymentsLoginOrGuest";
import { PaymentsOptions } from "./PaymentsOptions";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsApplePay } from "./PaymentsApplePay";
import { PaymentsGooglePay } from "./PaymentsGooglePay";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { SuggestedPaymentAmounts, PAYMENT_STATE } from "./types";
import { PaymentsSuccess } from "./PaymentsSuccess";

export interface PaymentsProps {
  postId: string;
  paymentAddress: string;
  newsroomName: string;
  isStripeConnected: boolean;
  handleClose(): void;
}

export interface PaymentsStates {
  usdToSpend: number;
  etherToSpend?: number;
  selectedUsdToSpend?: number;
  paymentAdjustedStripe: boolean;
  paymentAdjustedEth: boolean;
  shouldPublicize: boolean;
  paymentState: PAYMENT_STATE;
  resetEthPayments: boolean;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = {
      usdToSpend: 0,
      paymentAdjustedStripe: false,
      paymentAdjustedEth: false,
      shouldPublicize: false,
      paymentState: PAYMENT_STATE.SELECT_AMOUNT,
      resetEthPayments: false,
    };
  }

  public componentDidMount(): void {
    this.context.auth.ensureLoggedInUserEnabled();
  }

  public render(): JSX.Element {
    if (!this.context) {
      return <></>;
    }

    const {
      usdToSpend,
      etherToSpend,
      shouldPublicize,
      paymentState,
      selectedUsdToSpend,
      paymentAdjustedStripe,
      paymentAdjustedEth,
    } = this.state;
    const { postId, paymentAddress, newsroomName, isStripeConnected } = this.props;
    const userEmail = this.context && this.context.currentUser && this.context.currentUser.email;

    // User logged in from PAYMENT_CHOOSE_LOGIN_OR_GUEST state, which will be reflected in context, and we should now show them SELECT_PAYMENT_TYPE state instead.
    const proceedToPaymentType =
      paymentState === PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST && !!this.context.currentUser;

    if (paymentState === PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST && !proceedToPaymentType) {
      return <PaymentsLoginOrGuest handleNext={this.handleUpdateState} handleLogin={this.context.auth.showWeb3Login} />;
    }

    if (proceedToPaymentType || paymentState === PAYMENT_STATE.SELECT_PAYMENT_TYPE) {
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
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          paymentAdjustedEth={paymentAdjustedEth}
          selectedUsdToSpend={selectedUsdToSpend}
          etherToSpend={etherToSpend}
          handleEditPaymentType={this.handleEditPaymentType}
        >
          <PaymentsEth
            postId={postId}
            newsroomName={newsroomName}
            paymentAddress={paymentAddress}
            shouldPublicize={shouldPublicize}
            userEmail={userEmail}
            usdToSpend={usdToSpend}
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
          handleEditPaymentType={this.handleEditPaymentType}
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
          handleEditPaymentType={this.handleEditPaymentType}
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
          handleEditPaymentType={this.handleEditPaymentType}
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
    if (this.context && this.context.currentUser) {
      this.setState({ usdToSpend, paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE, shouldPublicize });
    } else {
      this.setState({ usdToSpend, paymentState: PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST, shouldPublicize });
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

  private handleEditPaymentType = () => {
    this.setState({ paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE });
  };
}
