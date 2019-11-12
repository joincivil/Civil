import * as React from "react";
import { Mutation, MutationFunc } from "react-apollo";
import { EthAddress } from "@joincivil/core";
import { PAYMENTS_ETH_MUTATION } from "./queries";
import { UsdEthConverter } from "../";
import { PaymentBtn, PaymentHide } from "./PaymentsStyledComponents";
import { ConnectWalletWarningText } from "./PaymentsTextComponents";
import { PaymentsEthForm } from "./PaymentsEthForm";
import { PaymentsEthUpdateAmount } from "./PaymentsEthUpdateAmount";
import { PaymentsEthWrapper } from "./PaymentsEthWrapper";

export interface PaymentsEthProps {
  postId: string;
  newsroomName: string;
  paymentAddress: EthAddress;
  shouldPublicize: boolean;
  userAddress?: EthAddress;
  userEmail?: string;
  etherToSpend?: number;
  usdToSpend: number;
  isWalletConnected: boolean;
  resetEthPayments: boolean;
  handleBoostUpdate(newUsdToSpend: number, selectedUsdToSpend: number, etherToSpend: number): void;
  handlePaymentSuccess(): void;
  handleEditPaymentType(): void;
}

export interface PaymentsEthStates {
  etherToSpend: number;
  usdToSpend: number;
  notEnoughEthError: boolean;
}

export class PaymentsEth extends React.Component<PaymentsEthProps, PaymentsEthStates> {
  public static getDerivedStateFromProps(props: PaymentsEthProps, state: PaymentsEthStates): PaymentsEthStates {
    if (props.resetEthPayments) {
      return {
        etherToSpend: props.etherToSpend || 0,
        usdToSpend: props.usdToSpend,
        notEnoughEthError: false,
      };
    }

    return {
      ...state,
    };
  }

  public constructor(props: PaymentsEthProps) {
    super(props);
    this.state = {
      etherToSpend: this.props.etherToSpend || 0,
      usdToSpend: this.props.usdToSpend,
      notEnoughEthError: false,
    };
  }

  public render(): JSX.Element {
    if (!this.props.isWalletConnected) {
      return (
        <PaymentsEthWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          etherToSpend={this.state.etherToSpend}
          usdToSpend={this.state.usdToSpend}
        >
          <ConnectWalletWarningText />
          <PaymentBtn>Select Wallet</PaymentBtn>
        </PaymentsEthWrapper>
      );
    }

    if (this.state.notEnoughEthError) {
      return (
        <PaymentsEthWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          etherToSpend={this.state.etherToSpend}
          usdToSpend={this.state.usdToSpend}
        >
          <PaymentsEthUpdateAmount
            etherToSpend={this.state.etherToSpend}
            usdToSpend={this.state.usdToSpend}
            handleBoostUpdate={this.props.handleBoostUpdate}
          />
        </PaymentsEthWrapper>
      );
    }

    if (this.state.etherToSpend === 0) {
      return (
        <PaymentsEthWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          etherToSpend={this.state.etherToSpend}
          usdToSpend={this.state.usdToSpend}
        >
          <PaymentHide>
            <UsdEthConverter
              fromValue={this.state.usdToSpend.toString()}
              onNotEnoughEthError={(error: boolean) => this.notEnoughEthError(error)}
              onConversion={(usd: number, eth: number) => this.setConvertedAmount(usd, eth)}
            />
          </PaymentHide>
        </PaymentsEthWrapper>
      );
    }

    return (
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
              handleEditPaymentType={this.props.handleEditPaymentType}
            />
          );
        }}
      </Mutation>
    );
  }

  private setConvertedAmount(usdToSpend: number, etherToSpend: number): void {
    const eth = parseFloat(etherToSpend.toFixed(6));
    this.setState({ usdToSpend, etherToSpend: eth });
  }

  private notEnoughEthError = (error: boolean) => {
    this.setState({ notEnoughEthError: error });
  };
}
