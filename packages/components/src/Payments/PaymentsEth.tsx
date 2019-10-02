import * as React from "react";
import { Mutation, MutationFunc } from "react-apollo";
import { EthAddress } from "@joincivil/core";
import { PAYMENTS_ETH_MUTATION } from "./queries";
import { UsdEthConverter } from "../";
import { LearnMore, PaymentBtn } from "./PaymentsStyledComponents";
import {
  WhyEthInfoText,
  WhatIsEthInfoText,
  CanUseCVLInfoText,
  ConnectWalletWarningText,
  ConnectMobileWalletModalText,
  PayWithEthDescriptionText,
} from "./PaymentsTextComponents";
import { PaymentsModal } from "./PaymentsModal";
import { PaymentsEthForm } from "./PaymentsEthForm";

export enum MODEL_CONTENT {
  WHY_ETH = "why eth",
  WHAT_IS_ETH = "what is eth",
  CAN_USE_CVL = "can I use cvl",
}

export interface PaymentsEthProps {
  linkId: string;
  newsroomName: string;
  paymentAddr: EthAddress;
  etherToSpend: number;
  usdToSpend: number;
  walletConnected: boolean;
  handlePaymentSuccess(): void;
}

export interface PaymentsEthStates {
  isMobileWalletModalOpen: boolean;
  isInfoModalOpen: boolean;
  modalContent: string;
  etherToSpend: number;
  usdToSpend: number;
  notEnoughEthError: boolean;
  paymentStarted: boolean;
}

export class PaymentsEth extends React.Component<PaymentsEthProps, PaymentsEthStates> {
  public constructor(props: PaymentsEthProps) {
    super(props);
    this.state = {
      isMobileWalletModalOpen: this.showMobileWalletModal(),
      isInfoModalOpen: false,
      modalContent: "",
      etherToSpend: this.props.etherToSpend || 0,
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
      <>
        <PayWithEthDescriptionText />
        {!this.props.walletConnected && <ConnectWalletWarningText />}
        <LearnMore>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHAT_IS_ETH)}>What is ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHY_ETH)}>Why ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.CAN_USE_CVL)}>Can I use CVL?</a>
        </LearnMore>
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
      </>
    );
  }

  private renderPaymentForm = (): JSX.Element => {
    return (
      <>
        <span>{this.state.etherToSpend + " ETH"}</span>

        <Mutation mutation={PAYMENTS_ETH_MUTATION}>
          {(paymentsCreateEtherPayment: MutationFunc) => {
            return (
              <PaymentsEthForm
                linkId={this.props.linkId}
                paymentAddr={this.props.paymentAddr}
                savePayment={paymentsCreateEtherPayment}
                etherToSpend={this.state.etherToSpend}
                usdToSpend={this.state.usdToSpend}
                newsroomName={this.props.newsroomName}
                handlePaymentSuccess={this.props.handlePaymentSuccess}
              />
            );
          }}
        </Mutation>

        <PaymentsModal open={this.state.isMobileWalletModalOpen} handleClose={this.handleClose}>
          <ConnectMobileWalletModalText />
        </PaymentsModal>
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

  private showMobileWalletModal = () => {
    let showMobileWalletModal = false;

    if (window.innerWidth < 800 && !this.props.walletConnected) {
      showMobileWalletModal = true;
    }

    return showMobileWalletModal;
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

  private openInfoModal = (modelContent: string) => {
    this.setState({ isInfoModalOpen: true, modalContent: modelContent });
  };

  private handleClose = () => {
    this.setState({ isInfoModalOpen: false, isMobileWalletModalOpen: false });
  };
}
