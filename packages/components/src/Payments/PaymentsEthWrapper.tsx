import * as React from "react";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";
import {
  PayWithEthText,
  PaymentEthNoticeText,
  WhyEthInfoText,
  WhatIsEthInfoText,
  CanUseCVLInfoText,
} from "./PaymentsTextComponents";
import { PaymentEthLearnMore, PaymentAmountEth } from "./PaymentsStyledComponents";
import { PaymentsModal } from "./PaymentsModal";

export enum MODEL_CONTENT {
  WHY_ETH,
  WHAT_IS_ETH,
  CAN_USE_CVL,
}

export interface PaymentsEthWrapperProps {
  etherToSpend: number;
  usdToSpend: number;
  children?: any;
}
export interface PaymentsEthWrapperStates {
  isInfoModalOpen: boolean;
  modalContent?: MODEL_CONTENT;
}

export class PaymentsEthWrapper extends React.Component<PaymentsEthWrapperProps, PaymentsEthWrapperStates> {
  public constructor(props: PaymentsEthWrapperProps) {
    super(props);
    this.state = {
      isInfoModalOpen: false,
    };
  }

  public render(): JSX.Element {
    return (
      <PaymentsFormWrapper payWithText={<PayWithEthText />} paymentNoticeText={<PaymentEthNoticeText />}>
        <PaymentEthLearnMore>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHAT_IS_ETH)}>What is ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHY_ETH)}>Why ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.CAN_USE_CVL)}>Can I use CVL?</a>
        </PaymentEthLearnMore>
        <PaymentAmountEth>
          <label>Boost</label>
          {this.props.etherToSpend + " ETH"} <span>&asymp; {"$" + this.props.usdToSpend}</span>
        </PaymentAmountEth>
        {this.props.children}
        <PaymentsModal open={this.state.isInfoModalOpen} handleClose={this.handleClose}>
          {this.renderInfoModal()}
        </PaymentsModal>
      </PaymentsFormWrapper>
    );
  }

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
