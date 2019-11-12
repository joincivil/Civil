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
  paymentAdjustedWarning: boolean;
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
      paymentAdjustedWarning: false,
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
      paymentAdjustedWarning,
      paymentAdjustedStripe,
      paymentAdjustedEth,
    } = this.state;
    const { postId, paymentAddress, newsroomName, isStripeConnected } = this.props;
    const currentUser = this.context && this.context.currentUser;
    const userChannelID = this.context && this.context.currentUser && this.context.currentUser.userChannel.id;
    const userEmail = this.context && this.context.currentUser && this.context.currentUser.email;
    const showWeb3Login = this.context.auth.showWeb3Login;
    const logout = this.context.auth.logout;

    // User logged in from PAYMENT_CHOOSE_LOGIN_OR_GUEST state, which will be reflected in context, and we should now show them SELECT_PAYMENT_TYPE state instead.
    const proceedToPaymentType =
      paymentState === PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST && !!this.context.currentUser;

    if (paymentState === PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST && !proceedToPaymentType) {
      return (
        <PaymentsLoginOrGuest
          handleNext={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          handleLogin={showWeb3Login}
        />
      );
    }

    if (proceedToPaymentType || paymentState === PAYMENT_STATE.SELECT_PAYMENT_TYPE) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          paymentAdjustedWarning={paymentAdjustedWarning}
          renderContext={this.context.renderContext}
          civilUser={currentUser}
          handleEditAmount={() => this.handleUpdateState(PAYMENT_STATE.SELECT_AMOUNT)}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_AMOUNT)}
          handleLogin={showWeb3Login}
          handleLogout={logout}
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
          renderContext={this.context.renderContext}
          civilUser={currentUser}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          handleLogin={showWeb3Login}
          handleLogout={logout}
        >
          <PaymentsEth
            postId={postId}
            newsroomName={newsroomName}
            paymentAddress={paymentAddress}
            shouldPublicize={shouldPublicize}
            userEmail={userEmail}
            userChannelID={userChannelID}
            usdToSpend={usdToSpend}
            etherToSpend={this.state.etherToSpend}
            resetEthPayments={this.state.resetEthPayments}
            context={this.context}
            handleBoostUpdate={this.handleUpdateBoostFromEth}
            handlePaymentSuccess={() => this.handleUpdateState(PAYMENT_STATE.PAYMENT_SUCCESS)}
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
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
          renderContext={this.context.renderContext}
          civilUser={currentUser}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          handleLogin={showWeb3Login}
          handleLogout={logout}
        >
          <PaymentsStripe
            postId={postId}
            newsroomName={newsroomName}
            shouldPublicize={shouldPublicize}
            userEmail={userEmail}
            userChannelID={userChannelID}
            usdToSpend={usdToSpend}
            handlePaymentSuccess={() => this.handleUpdateState(PAYMENT_STATE.PAYMENT_SUCCESS)}
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.APPLE_PAY) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          renderContext={this.context.renderContext}
          civilUser={currentUser}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          handleLogin={showWeb3Login}
          handleLogout={logout}
        >
          <PaymentsApplePay
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
            newsroomName={newsroomName}
            usdToSpend={usdToSpend}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.GOOGLE_PAY) {
      return (
        <PaymentsWrapper
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          renderContext={this.context.renderContext}
          civilUser={currentUser}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          handleLogin={showWeb3Login}
          handleLogout={logout}
        >
          <PaymentsGooglePay
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
            newsroomName={newsroomName}
            usdToSpend={usdToSpend}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.PAYMENT_SUCCESS) {
      return (
        <PaymentsWrapper newsroomName={newsroomName} renderContext={this.context.renderContext}>
          <PaymentsSuccess newsroomName={newsroomName} usdToSpend={usdToSpend} handleClose={this.props.handleClose} />
        </PaymentsWrapper>
      );
    }

    return (
      <PaymentsWrapper
        newsroomName={newsroomName}
        renderContext={this.context.renderContext}
        handleBack={this.props.handleClose}
      >
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
    if (this.context && this.context.currentUser) {
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
