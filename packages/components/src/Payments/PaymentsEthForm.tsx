import * as React from "react";
import { MutationFunc } from "react-apollo";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { isValidEmail } from "@joincivil/utils";
import { PaymentNotice, PaymentTerms, PaymentEthUserInfoForm } from "./PaymentsStyledComponents";
import {
  TransactionButton,
  TransactionButtonModalContentComponentsProps,
  progressModalStates,
  CivilContext,
  ICivilContext,
} from "../";
import { InputValidationUI, INPUT_STATE } from "./InputValidationUI";
import {
  PaymentInProgressText,
  PaymentSuccessText,
  PaymentErrorText,
  PaymentEthNoticeText,
  PaymentEthTermsText,
} from "./PaymentsTextComponents";

export interface PaymentsEthFormProps {
  linkId: string;
  etherToSpend: number;
  usdToSpend: number;
  newsroomName: string;
  paymentAddr: EthAddress;
  savePayment: MutationFunc;
  handlePaymentSuccess(): void;
}

export interface PaymentsEthFormState {
  email: string;
  emailState: string;
  fromAddr?: EthAddress;
}

export class PaymentsEthForm extends React.Component<PaymentsEthFormProps, PaymentsEthFormState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: PaymentsEthFormProps) {
    super(props);
    this.state = {
      email: "",
      emailState: INPUT_STATE.EMPTY,
    };
  }

  public async componentDidMount(): Promise<void> {
    const civil = this.context.civil;
    if (civil) {
      const account = await civil.accountStream.first().toPromise();
      this.setState({ fromAddr: account });
    }
  }

  public render(): JSX.Element {
    const PAY_MODAL_COMPONENTS: TransactionButtonModalContentComponentsProps = {
      [progressModalStates.IN_PROGRESS]: <PaymentInProgressText />,
      [progressModalStates.SUCCESS]: <PaymentSuccessText />,
      [progressModalStates.ERROR]: <PaymentErrorText />,
    };

    return (
      <form>
        <PaymentEthUserInfoForm>
          <label>Email (optional)</label>
          <InputValidationUI inputState={this.state.emailState} width={"500px"}>
            <input id="email" name="email" type="email" maxLength={254} onBlur={() => this.handleOnBlur(event)} />
          </InputValidationUI>
        </PaymentEthUserInfoForm>
        <PaymentNotice>
          <PaymentEthNoticeText />
        </PaymentNotice>
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
          Tip Newsroom
        </TransactionButton>
        <PaymentTerms>
          <PaymentEthTermsText />
        </PaymentTerms>
      </form>
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
    this.context.fireAnalyticsEvent("tips", "start submit ETH support", this.props.linkId, this.props.usdToSpend);
    if (this.context.civil && (window as any).ethereum) {
      return this.context.civil.simplePayment(this.props.paymentAddr, this.props.etherToSpend.toString());
    }
  };

  private handleTransactionHash = async (txHash: TxHash) => {
    this.context.fireAnalyticsEvent("tips", "ETH support submitted", this.props.linkId, this.props.usdToSpend);
    await this.props.savePayment({
      variables: {
        postID: this.props.linkId,
        input: {
          transactionID: txHash,
          paymentAddress: this.props.paymentAddr,
          fromAddress: this.state.fromAddr,
          amount: this.props.etherToSpend,
          usdAmount: this.props.usdToSpend.toString(),
          emailAddress: this.state.email,
        },
      },
    });
  };

  private onTransactionError = (err: string) => {
    this.context.fireAnalyticsEvent("tips", "ETH support rejected", this.props.linkId, this.props.usdToSpend);
  };

  private postTransaction = () => {
    this.context.fireAnalyticsEvent("tips", "ETH support confirmed", this.props.linkId, this.props.usdToSpend);
  };
}
