import * as React from "react";
import { ICivilContext, CivilContext } from "../context";
import { PaymentsAmount } from "./PaymentsAmount";
import { PaymentsLoginOrGuest } from "./PaymentsLoginOrGuest";
import { PaymentsSelectType } from "./PaymentsSelectType";
import { PaymentsEth } from "./PaymentsEth";
import { PaymentsStripe } from "./PaymentsStripe";
import { PaymentsApplePay } from "./PaymentsApplePay";
import { PaymentsGooglePay } from "./PaymentsGooglePay";
import { PaymentsWrapper } from "./PaymentsWrapper";
import { SuggestedPaymentAmounts, CreditCardMin, PAYMENT_STATE } from "./types";
import { PaymentsSuccess } from "./PaymentsSuccess";

export interface PaymentsProps {
  postId: string;
  usdToSpend?: number;
  boostType?: string;
  paymentAddress: string;
  newsroomName: string;
  activeChallenge: boolean;
  isStripeConnected: boolean;
  stripeAccountID: string;
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
  userSubmittedEmail: boolean;
  paymentInProgress: boolean;
  waitingForConfirmation: boolean;
}

export class Payments extends React.Component<PaymentsProps, PaymentsStates> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = {
      usdToSpend: props.usdToSpend || 0,
      paymentAdjustedWarning: false,
      paymentAdjustedStripe: false,
      paymentAdjustedEth: false,
      shouldPublicize: true,
      paymentState: PAYMENT_STATE.SELECT_AMOUNT,
      resetEthPayments: false,
      userSubmittedEmail: false,
      paymentInProgress: false,
      waitingForConfirmation: false,
    };
  }

  public componentDidMount(): void {
    this.context.auth.ensureLoggedInUserEnabled();

    if (this.props.boostType === "project") {
      const paymentAdjustedWarning = this.props.usdToSpend && this.props.usdToSpend <= CreditCardMin ? true : false;
      this.setState({
        paymentState: PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST,
        paymentAdjustedWarning,
      });
    }
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
      userSubmittedEmail,
      paymentInProgress,
      waitingForConfirmation,
    } = this.state;
    const {
      postId,
      paymentAddress,
      newsroomName,
      activeChallenge,
      isStripeConnected,
      stripeAccountID,
      boostType,
      handleClose,
    } = this.props;
    const showWeb3Login = this.context.auth.showWeb3Login;

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
          boostType={boostType}
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          activeChallenge={activeChallenge}
          paymentAdjustedWarning={paymentAdjustedWarning}
          handleEditAmount={() => this.handleUpdateState(PAYMENT_STATE.SELECT_AMOUNT)}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_AMOUNT)}
        >
          <PaymentsSelectType
            postId={postId}
            usdToSpend={usdToSpend}
            isStripeConnected={isStripeConnected}
            newsroomName={newsroomName}
            shouldPublicize={shouldPublicize}
            handleShouldPublicize={this.handleShouldPublicize}
            handleNext={this.handleUpdateState}
            handlePaymentSuccess={() => this.handleUpdateState(PAYMENT_STATE.PAYMENT_SUCCESS)}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.ETH_PAYMENT) {
      return (
        <PaymentsWrapper
          boostType={boostType}
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          activeChallenge={activeChallenge}
          paymentAdjustedEth={paymentAdjustedEth}
          selectedUsdToSpend={selectedUsdToSpend}
          etherToSpend={etherToSpend}
          paymentInProgress={paymentInProgress}
          waitingForConfirmation={waitingForConfirmation}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          handleClose={handleClose}
        >
          <PaymentsEth
            postId={postId}
            newsroomName={newsroomName}
            paymentAddress={paymentAddress}
            shouldPublicize={shouldPublicize}
            usdToSpend={usdToSpend}
            etherToSpend={this.state.etherToSpend}
            resetEthPayments={this.state.resetEthPayments}
            handleBoostUpdate={this.handleUpdateBoostFromEth}
            handlePaymentSuccess={this.handlePaymentSuccess}
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
            handlePaymentInProgress={this.handlePaymentInProgress}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.STRIPE_PAYMENT) {
      return (
        <PaymentsWrapper
          boostType={boostType}
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          activeChallenge={activeChallenge}
          paymentAdjustedStripe={paymentAdjustedStripe}
          selectedUsdToSpend={selectedUsdToSpend}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
        >
          <PaymentsStripe
            postId={postId}
            newsroomName={newsroomName}
            shouldPublicize={shouldPublicize}
            usdToSpend={usdToSpend}
            stripeAccountID={stripeAccountID}
            handlePaymentSuccess={this.handlePaymentSuccess}
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
          />
        </PaymentsWrapper>
      );
    }

    if (paymentState === PAYMENT_STATE.APPLE_PAY) {
      return (
        <PaymentsWrapper
          boostType={boostType}
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          activeChallenge={activeChallenge}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
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
          boostType={boostType}
          usdToSpend={usdToSpend}
          newsroomName={newsroomName}
          activeChallenge={activeChallenge}
          handleBack={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
        >
          <PaymentsGooglePay
            handleEditPaymentType={() => this.handleUpdateState(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}
            newsroomName={newsroomName}
            usdToSpend={usdToSpend}
          />
        </PaymentsWrapper>
      );
    }

    if (
      paymentState === PAYMENT_STATE.PAYMENT_SUCCESS ||
      paymentState === PAYMENT_STATE.PAYMENT_SUCCESS_WITH_SAVED_EMAIL
    ) {
      return (
        <PaymentsWrapper newsroomName={newsroomName} activeChallenge={activeChallenge} boostType={boostType}>
          <PaymentsSuccess
            newsroomName={newsroomName}
            usdToSpend={usdToSpend}
            handleClose={handleClose}
            userSubmittedEmail={userSubmittedEmail}
          />
          {paymentState === PAYMENT_STATE.PAYMENT_SUCCESS_WITH_SAVED_EMAIL && (
            <p>Please check your email to confirm your email address.</p>
          )}
        </PaymentsWrapper>
      );
    }

    return (
      <PaymentsWrapper
        newsroomName={newsroomName}
        activeChallenge={activeChallenge}
        handleBack={handleClose}
        boostType={boostType}
      >
        <PaymentsAmount
          newsroomName={newsroomName}
          suggestedAmounts={SuggestedPaymentAmounts}
          handleAmount={this.handleAmount}
        />
      </PaymentsWrapper>
    );
  }

  private handleShouldPublicize = (shouldPublicize: boolean) => {
    this.setState({ shouldPublicize });
  };

  private handlePaymentSuccess = (userSubmittedEmail: boolean, didSaveEmail: boolean, etherToSpend?: number) => {
    if (didSaveEmail) {
      this.setState({ paymentState: PAYMENT_STATE.PAYMENT_SUCCESS_WITH_SAVED_EMAIL, userSubmittedEmail, etherToSpend });
    } else {
      this.setState({ paymentState: PAYMENT_STATE.PAYMENT_SUCCESS, userSubmittedEmail, etherToSpend });
    }
  };

  private handlePaymentInProgress = (paymentInProgress: boolean, waitingForConfirmation: boolean) => {
    this.setState({ paymentInProgress, waitingForConfirmation });
  };

  private handleUpdateState = (paymentState: PAYMENT_STATE) => {
    if (paymentState === PAYMENT_STATE.STRIPE_PAYMENT && this.state.usdToSpend < CreditCardMin) {
      this.setState({
        paymentState,
        usdToSpend: CreditCardMin,
        selectedUsdToSpend: this.state.usdToSpend,
        paymentAdjustedStripe: true,
        paymentAdjustedEth: true,
      });
    } else {
      this.setState({ paymentState, paymentAdjustedStripe: false, paymentAdjustedEth: false });
    }
  };

  private handleAmount = (usdToSpend: number) => {
    const paymentAdjustedWarning = usdToSpend < CreditCardMin ? true : false;
    if (this.context && this.context.currentUser) {
      this.setState({
        usdToSpend,
        paymentState: PAYMENT_STATE.SELECT_PAYMENT_TYPE,
        paymentAdjustedWarning,
      });
    } else {
      this.setState({
        usdToSpend,
        paymentState: PAYMENT_STATE.PAYMENT_CHOOSE_LOGIN_OR_GUEST,
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
