import * as React from "react";
import {
  BoostPayCardDetails,
  LearnMore,
  BoostFlexEth,
  BoostButton,
  BoostEthConfirm,
  BoostAmount,
} from "../BoostStyledComponents";
import {
  WhyEthModalText,
  WhatIsEthModalText,
  CanUseCVLText,
  BoostConnectWalletWarningText,
  BoostPayWalletText,
  BoostMobileWalletModalText,
} from "../BoostTextComponents";
import { BoostModal } from "../BoostModal";
import { BoostPayFormEth } from "./BoostPayFormEth";
import { UsdEthConverter, HollowGreenCheck, CivilContext, ICivilContext } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import { Mutation, MutationFunc } from "react-apollo";
import { boostPayEthMutation } from "../queries";
import { BoostPayOption } from "./BoostPayOption";

export enum MODEL_CONTENT {
  WHY_ETH = "why eth",
  WHAT_IS_ETH = "what is eth",
  CAN_USE_CVL = "can I use cvl",
}

export interface BoostPayEthProps {
  selected: boolean;
  boostId: string;
  newsroomName: string;
  title: string;
  paymentAddr: EthAddress;
  paymentStarted?: boolean;
  optionLabel: string | JSX.Element;
  paymentType: string;
  etherToSpend: number;
  usdToSpend: number;
  handlePaymentSelected?(paymentType: string): void;
  handleNext(etherToSpend: number, usdToSpend: number): void;
  handlePaymentSuccess(): void;
}

export interface BoostPayEthStates {
  isMobileWalletModalOpen: boolean;
  isInfoModalOpen: boolean;
  modalContent: string;
  etherToSpend: number;
  usdToSpend: number;
  notEnoughEthError: boolean;
  walletConnected: boolean;
}

export class BoostPayEth extends React.Component<BoostPayEthProps, BoostPayEthStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  public constructor(props: BoostPayEthProps) {
    super(props);
    this.state = {
      isMobileWalletModalOpen: false,
      isInfoModalOpen: false,
      modalContent: "",
      etherToSpend: this.props.etherToSpend || 0,
      usdToSpend: this.props.usdToSpend,
      notEnoughEthError: false,
      walletConnected: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    this.setState({
      isMobileWalletModalOpen: this.showMobileWalletModal(),
    });
    if (this.context.civil) {
      await this.context.civil.currentProviderEnable();
      await this.setState({
        walletConnected: true,
        // they clearly have a wallet, so:
        isMobileWalletModalOpen: false,
      });
    }
  }

  public render(): JSX.Element {
    if (this.props.paymentStarted) {
      return <>{this.renderPaymentForm(this.state.etherToSpend, this.state.usdToSpend)}</>;
    }

    return <>{this.renderDefaultOption()}</>;
  }

  private renderDefaultOption = (): JSX.Element => {
    return (
      <>
        <BoostPayOption
          paymentType={this.props.paymentType}
          optionLabel={this.props.optionLabel}
          selected={this.props.selected}
          handlePaymentSelected={this.props.handlePaymentSelected}
        >
          <BoostPayCardDetails>
            <BoostPayWalletText />
            {this.props.selected ? this.renderEthCheck() : <></>}
          </BoostPayCardDetails>
        </BoostPayOption>

        <BoostModal open={this.state.isInfoModalOpen} handleClose={this.handleClose}>
          {this.renderInfoModal()}
        </BoostModal>
      </>
    );
  };

  private renderEthCheck = () => {
    let disableBtn;
    if (!this.state.walletConnected || this.state.usdToSpend <= 0 || this.state.notEnoughEthError) {
      disableBtn = true;
    } else {
      disableBtn = false;
    }

    return (
      <>
        {!this.state.walletConnected && <BoostConnectWalletWarningText />}
        <LearnMore>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHAT_IS_ETH)}>What is ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHY_ETH)}>Why ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.CAN_USE_CVL)}>Can I use CVL?</a>
        </LearnMore>
        <h3>Boost Amount</h3>
        <BoostFlexEth>
          <UsdEthConverter
            fromValue={this.state.usdToSpend.toString()}
            onNotEnoughEthError={(error: boolean) => this.notEnoughEthError(error)}
            onConversion={(usd: number, eth: number) => this.setConvertedAmount(usd, eth)}
            displayErrorMsg={this.state.walletConnected}
          />
          <BoostButton
            disabled={disableBtn}
            onClick={() => this.props.handleNext(this.state.etherToSpend, this.state.usdToSpend)}
          >
            Next
          </BoostButton>
        </BoostFlexEth>

        <BoostModal open={this.state.isMobileWalletModalOpen} handleClose={this.handleClose}>
          <BoostMobileWalletModalText />
        </BoostModal>
      </>
    );
  };

  private renderPaymentForm = (etherToSpend: number, usdToSpend: number): JSX.Element => {
    return (
      <>
        <BoostPayOption
          paymentType={this.props.paymentType}
          optionLabel={this.props.optionLabel}
          selected={this.props.selected}
        >
          <BoostPayCardDetails>
            <BoostPayWalletText />
            <h3>Boost Amount</h3>
            <BoostAmount>
              <span>{etherToSpend + " ETH"}</span> {"($" + usdToSpend.toFixed(2) + ")"}
            </BoostAmount>
            <BoostEthConfirm>
              <HollowGreenCheck height={15} width={15} /> You have enough ETH in your connected wallet.
            </BoostEthConfirm>
          </BoostPayCardDetails>
        </BoostPayOption>

        <Mutation mutation={boostPayEthMutation}>
          {(paymentsCreateEtherPayment: MutationFunc) => {
            return (
              <BoostPayFormEth
                boostId={this.props.boostId}
                paymentAddr={this.props.paymentAddr}
                title={this.props.title}
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

  private showMobileWalletModal = () => {
    let showMobileWalletModal = false;

    // TODO(sruddy) do we have a check for mobile browser util?
    if (window.innerWidth < 800 && !this.state.walletConnected) {
      showMobileWalletModal = true;
    }

    return showMobileWalletModal;
  };

  private renderInfoModal = () => {
    switch (this.state.modalContent) {
      case MODEL_CONTENT.WHY_ETH:
        return <WhyEthModalText />;
      case MODEL_CONTENT.WHAT_IS_ETH:
        return <WhatIsEthModalText />;
      case MODEL_CONTENT.CAN_USE_CVL:
        return <CanUseCVLText />;
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
