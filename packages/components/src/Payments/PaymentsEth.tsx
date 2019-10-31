import * as React from "react";
import { Mutation, MutationFunc } from "react-apollo";
import { EthAddress } from "@joincivil/core";
import { PAYMENTS_ETH_MUTATION } from "./queries";
import { UsdEthConverter } from "../";
import { PaymentEthLearnMore, PaymentBtn } from "./PaymentsStyledComponents";
import {
  PayWithEthText,
  PaymentEthNoticeText,
  WhyEthInfoText,
  WhatIsEthInfoText,
  CanUseCVLInfoText,
  ConnectWalletWarningText,
} from "./PaymentsTextComponents";
import { PaymentsModal } from "./PaymentsModal";
import { PaymentsEthForm } from "./PaymentsEthForm";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";
import { PAYMENT_STATE } from "./types";

export enum MODEL_CONTENT {
  WHY_ETH,
  WHAT_IS_ETH,
  CAN_USE_CVL,
}

export interface PaymentsEthProps {
  postId: string;
  newsroomName: string;
  paymentAddress: EthAddress;
  shouldPublicize: boolean;
  userAddress?: EthAddress;
  userEmail?: string;
  usdToSpend: number;
  isWalletConnected: boolean;
  handlePaymentSuccess(paymentState: PAYMENT_STATE): void;
}

export interface PaymentsEthStates {
  isInfoModalOpen: boolean;
  modalContent?: MODEL_CONTENT;
  etherToSpend: number;
  usdToSpend: number;
  notEnoughEthError: boolean;
  paymentStarted: boolean;
}

export class PaymentsEth extends React.Component<PaymentsEthProps, PaymentsEthStates> {
  public constructor(props: PaymentsEthProps) {
    super(props);
    this.state = {
      isInfoModalOpen: false,
      etherToSpend: 0,
      usdToSpend: this.props.usdToSpend,
      notEnoughEthError: false,
      paymentStarted: false,
    };
  }

  public render(): JSX.Element {
    if (this.state.paymentStarted) {
      return <>{this.renderPaymentForm()}</>;
    }

    return (
      <PaymentsFormWrapper payWithText={<PayWithEthText />} paymentNoticeText={<PaymentEthNoticeText />}>
        {!this.props.isWalletConnected && <ConnectWalletWarningText />}
        <PaymentEthLearnMore>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHAT_IS_ETH)}>What is ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHY_ETH)}>Why ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.CAN_USE_CVL)}>Can I use CVL?</a>
        </PaymentEthLearnMore>
        <UsdEthConverter
          fromValue={this.state.usdToSpend.toString()}
          onNotEnoughEthError={(error: boolean) => this.notEnoughEthError(error)}
          onConversion={(usd: number, eth: number) => this.setConvertedAmount(usd, eth)}
        />
        <PaymentBtn onClick={this.handlePaymentStarted} disabled={this.state.notEnoughEthError}>
          Next
        </PaymentBtn>

        <PaymentsModal open={this.state.isInfoModalOpen} handleClose={this.handleClose}>
          {this.renderInfoModal()}
        </PaymentsModal>
      </PaymentsFormWrapper>
    );
  }

  private renderPaymentForm = (): JSX.Element => {
    return (
      <>
        <Mutation mutation={PAYMENTS_ETH_MUTATION}>
          {(paymentsCreateEtherPayment: MutationFunc) => {
            return (
              <PaymentsEthForm
                postId={this.props.postId}
                paymentAddress={this.props.paymentAddress}
                userAddress={this.props.userAddress}
                userEmail={this.props.userEmail}
                shouldPublicize={this.props.shouldPublicize}
                savePayment={paymentsCreateEtherPayment}
                etherToSpend={this.state.etherToSpend}
                usdToSpend={this.state.usdToSpend}
                newsroomName={this.props.newsroomName}
                handlePaymentSuccess={this.props.handlePaymentSuccess}
              />
            );
          }}
        </Mutation>
      </>
    );
  };

  private setConvertedAmount(usdToSpend: number, etherToSpend: number): void {
    const eth = parseFloat(etherToSpend.toFixed(6));
    this.setState({ usdToSpend, etherToSpend: eth });
  }

  private notEnoughEthError = (error: boolean) => {
    this.setState({ notEnoughEthError: error });
  };

  private handlePaymentStarted = () => {
    this.setState({ paymentStarted: true });
  };

  private renderInfoModal = () => {
    switch (this.state.modalContent) {
      case MODEL_CONTENT.WHY_ETH:
        return <WhyEthInfoText />;
      case MODEL_CONTENT.WHAT_IS_ETH:
        return <WhatIsEthInfoText />;
      case MODEL_CONTENT.CAN_USE_CVL:
        return <CanUseCVLInfoText />;
      default:
        return <></>;
    }
  };

  private openInfoModal = (modelContent: any) => {
    this.setState({ isInfoModalOpen: true, modalContent: modelContent });
  };

  private handleClose = () => {
    this.setState({ isInfoModalOpen: false });
  };
}
