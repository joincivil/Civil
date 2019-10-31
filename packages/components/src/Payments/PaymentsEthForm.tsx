import * as React from "react";
import { MutationFunc } from "react-apollo";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { isValidEmail } from "@joincivil/utils";
import { PaymentAmountEth, PaymentTerms, PaymentInputLabel } from "./PaymentsStyledComponents";
import {
  TransactionButton,
  TransactionButtonModalContentComponentsProps,
  progressModalStates,
  CivilContext,
  ICivilContext,
} from "../";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";
import { InputValidationUI } from "./PaymentsInputValidationUI";
import {
  PayWithEthText,
  PaymentInProgressText,
  PaymentErrorText,
  PaymentEthNoticeText,
  PaymentTermsText,
  PaymentEmailConfirmationText,
} from "./PaymentsTextComponents";
import { PAYMENT_STATE, INPUT_STATE } from "./types";

export interface PaymentsEthFormProps {
  postId: string;
  etherToSpend: number;
  usdToSpend: number;
  shouldPublicize: boolean;
  newsroomName: string;
  paymentAddress: EthAddress;
  userAddress?: EthAddress;
  userEmail?: string;
  savePayment: MutationFunc;
  handlePaymentSuccess(paymentState: PAYMENT_STATE): void;
}

export interface PaymentsEthFormState {
  email: string;
  emailState: string;
}

export class PaymentsEthForm extends React.Component<PaymentsEthFormProps, PaymentsEthFormState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: PaymentsEthFormProps) {
    super(props);
    this.state = {
      email: this.props.userEmail || "",
      emailState: INPUT_STATE.EMPTY,
    };
  }

  public render(): JSX.Element {
    const PAY_MODAL_COMPONENTS: TransactionButtonModalContentComponentsProps = {
      [progressModalStates.IN_PROGRESS]: <PaymentInProgressText />,
      [progressModalStates.SUCCESS]: <></>,
      [progressModalStates.ERROR]: <PaymentErrorText />,
    };

    return (
      <>
        <PaymentsFormWrapper payWithText={<PayWithEthText />} paymentNoticeText={<PaymentEthNoticeText />}>
          <PaymentAmountEth>
            <label>Boost</label>
            {this.props.etherToSpend + " ETH"} <span>&asymp; {"$" + this.props.usdToSpend}</span>
          </PaymentAmountEth>
          <PaymentInputLabel>Email address (optional)</PaymentInputLabel>
          <InputValidationUI inputState={this.state.emailState}>
            <input
              defaultValue={this.state.email}
              id="email"
              name="email"
              type="email"
              maxLength={254}
              onBlur={() => this.handleOnBlur(event)}
            />
            <PaymentEmailConfirmationText />
          </InputValidationUI>
        </PaymentsFormWrapper>
        <TransactionButton
          transactions={[
            {
              transaction: this.sendPayment,
              handleTransactionHash: this.handleTransactionHash,
              onTransactionError: this.onTransactionError,
              postTransaction: this.postTransaction,
            },
          ]}
          modalContentComponents={PAY_MODAL_COMPONENTS}
        >
          Complete Boost
        </TransactionButton>
        <PaymentTerms>
          <PaymentTermsText />
        </PaymentTerms>
      </>
    );
  }

  private handleOnBlur = (event: any) => {
    const state = event.target.id;
    const value = event.target.value;

    switch (state) {
      case "email":
        const validEmail = isValidEmail(event.target.value);
        validEmail || value === ""
          ? this.setState({ email: value, emailState: INPUT_STATE.VALID })
          : this.setState({ emailState: INPUT_STATE.INVALID });
        break;
      default:
        break;
    }
  };

  private sendPayment = async (): Promise<TwoStepEthTransaction<any> | void> => {
    this.context.fireAnalyticsEvent("tips", "start submit ETH support", this.props.postId, this.props.usdToSpend);
    if (this.context.civil && (window as any).ethereum) {
      return this.context.civil.simplePayment(this.props.paymentAddress, this.props.etherToSpend.toString());
    }
  };

  private handleTransactionHash = async (txHash: TxHash) => {
    this.context.fireAnalyticsEvent("tips", "ETH support submitted", this.props.postId, this.props.usdToSpend);
    await this.props.savePayment({
      variables: {
        postID: this.props.postId,
        input: {
          transactionID: txHash,
          paymentAddress: this.props.paymentAddress,
          fromAddress: this.props.userAddress,
          amount: this.props.etherToSpend,
          usdAmount: this.props.usdToSpend.toString(),
          emailAddress: this.state.email,
          shouldPublicize: this.props.shouldPublicize,
        },
      },
    });
  };

  private onTransactionError = (err: string) => {
    this.context.fireAnalyticsEvent("tips", "ETH support rejected", this.props.postId, this.props.usdToSpend);
  };

  private postTransaction = () => {
    this.context.fireAnalyticsEvent("tips", "ETH support confirmed", this.props.postId, this.props.usdToSpend);
    this.props.handlePaymentSuccess(PAYMENT_STATE.PAYMENT_SUCCESS);
  };
}
