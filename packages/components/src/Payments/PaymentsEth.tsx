import * as React from "react";
import { Mutation, MutationFunc } from "react-apollo";
import { EthAddress } from "@joincivil/typescript-types";
import { ICivilContext, CivilContext } from "../context";
import { PAYMENTS_ETH_MUTATION, SET_EMAIL_MUTATION } from "./queries";
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
  etherToSpend?: number;
  usdToSpend: number;
  resetEthPayments: boolean;
  handleBoostUpdate(newUsdToSpend: number, selectedUsdToSpend: number, etherToSpend: number): void;
  handlePaymentSuccess(userSubmittedEmail: boolean, didSaveEmail: boolean, etherToSpend: number): void;
  handleEditPaymentType(): void;
  handlePaymentInProgress(ethPaymentInProgress: boolean, waitingForConfirmation: boolean): void;
}

export interface PaymentsEthStates {
  etherToSpend: number;
  usdToSpend: number;
  notEnoughEthError: boolean;
  userAddress?: string;
}

export class PaymentsEth extends React.Component<PaymentsEthProps, PaymentsEthStates> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

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
      etherToSpend: props.etherToSpend || 0,
      usdToSpend: props.usdToSpend,
      notEnoughEthError: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    // Grab user address after any `currentProviderEnable` call. For users who aren't logged in to Civil but are logged in to metamask, this is the only way we can get their address:
    this.setState({
      userAddress: await this.context.civil.accountStream.first().toPromise(),
    });
  }

  public render(): JSX.Element {
    const userChannelID = (this.context && this.context.currentUser && this.context.currentUser.userChannel.id) || "";
    const userEmail =
      this.context && this.context.currentUser && this.context.currentUser.userChannel.EmailAddressRestricted;

    const userAddress =
      this.state.userAddress || (this.context && this.context.currentUser && this.context.currentUser.ethAddress);

    if (!userAddress) {
      return (
        <PaymentsEthWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          etherToSpend={this.state.etherToSpend}
          usdToSpend={this.state.usdToSpend}
        >
          <ConnectWalletWarningText />
          <PaymentBtn
            onClick={async () => {
              await this.context.civil.currentProviderEnable();
            }}
          >
            Select Wallet
          </PaymentBtn>
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
            <Mutation mutation={SET_EMAIL_MUTATION}>
              {(setEmailMutation: MutationFunc) => {
                return (
                  <PaymentsEthForm
                    postId={this.props.postId}
                    paymentAddress={this.props.paymentAddress}
                    userAddress={userAddress}
                    userEmail={userEmail}
                    userChannelID={userChannelID}
                    shouldPublicize={this.props.shouldPublicize}
                    savePayment={paymentsCreateEtherPayment}
                    setEmail={setEmailMutation}
                    etherToSpend={this.state.etherToSpend}
                    usdToSpend={this.state.usdToSpend}
                    newsroomName={this.props.newsroomName}
                    handlePaymentSuccess={this.props.handlePaymentSuccess}
                    handleEditPaymentType={this.props.handleEditPaymentType}
                    handlePaymentInProgress={this.props.handlePaymentInProgress}
                  />
                );
              }}
            </Mutation>
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
