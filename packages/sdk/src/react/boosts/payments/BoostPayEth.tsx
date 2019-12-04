import * as React from "react";
import styled from "styled-components";
import { BoostPayCardDetails, LearnMore, BoostButton, BoostEthConfirm, BoostAmount } from "../BoostStyledComponents";
import {
  WhyEthModalText,
  WhatIsEthModalText,
  CanUseCVLText,
  BoostConnectWalletWarningText,
  BoostPayWalletText,
} from "../BoostTextComponents";
import { BoostModal } from "../BoostModal";
import { BoostPayFormEth } from "./BoostPayFormEth";
import { UsdEthConverter, HollowGreenCheck, CivilContext, ICivilContext } from "@joincivil/components";
import { EthAddress } from "@joincivil/typescript-types";
import { Mutation, MutationFunc } from "react-apollo";
import { boostPayEthMutation } from "../queries";
import { BoostPayOption } from "./BoostPayOption";

const StyledUsdEthConverter = styled(UsdEthConverter)`
  margin-bottom: -15px;
  max-width: 500px;

  label {
    display: none;
  }
`;

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
      isInfoModalOpen: false,
      modalContent: "",
      etherToSpend: this.props.etherToSpend || 0,
      usdToSpend: this.props.usdToSpend,
      notEnoughEthError: false,
      walletConnected: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.context.civil) {
      const account = await this.context.civil.accountStream.first().toPromise();
      if (account) {
        this.setState({ walletConnected: true });
      }
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
        <LearnMore>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHAT_IS_ETH)}>What is ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.WHY_ETH)}>Why ETH?</a>
          <a onClick={() => this.openInfoModal(MODEL_CONTENT.CAN_USE_CVL)}>Can I use CVL?</a>
        </LearnMore>

        <h3>Boost Amount</h3>
        <StyledUsdEthConverter
          fromValue={this.state.usdToSpend.toString()}
          onNotEnoughEthError={(error: boolean) => this.notEnoughEthError(error)}
          onConversion={(usd: number, eth: number) => this.setConvertedAmount(usd, eth)}
          displayErrorMsg={this.state.walletConnected}
        />

        {this.state.walletConnected ? (
          <BoostButton disabled={disableBtn} onClick={this.goNext}>
            Next
          </BoostButton>
        ) : (
          <div>
            <BoostButton onClick={this.enableEth}>
              {this.context.currentUser ? "Enable" : "Select"}&nbsp;Wallet
            </BoostButton>
            {!this.context.currentUser && <BoostConnectWalletWarningText />}
          </div>
        )}
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

  private goNext = () => {
    if (this.state.usdToSpend <= 0) {
      return;
    }
    this.props.handleNext(this.state.etherToSpend, this.state.usdToSpend);
  };

  private enableEth = async () => {
    await this.context.civil!.currentProviderEnable();
    await this.context.civil!.accountStream.first().toPromise();

    // only do this stuff if wallet not currently connected, possible to get multiple
    // promises that resolve immediately after user enables if they cancel
    // wallet selection multiple times before going through with it
    if (!this.state.walletConnected) {
      this.setState({ walletConnected: true });
      this.goNext();
    }
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
    this.setState({ isInfoModalOpen: false });
  };
}
