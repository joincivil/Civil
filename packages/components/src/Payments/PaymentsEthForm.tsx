import * as React from "react";
import { MutationFunc } from "react-apollo";
import { TwoStepEthTransaction } from "@joincivil/core";
import { EthAddress, TxHash } from "@joincivil/typescript-types";
import { isValidEmail } from "@joincivil/utils";
import {
  PaymentTerms,
  PaymentInputLabel,
  CheckboxContainer,
  CheckboxSection,
  CheckboxLabel,
} from "./PaymentsStyledComponents";
import { TransactionButtonNoModal, CivilContext, ICivilContext } from "../";
import { PaymentsEthWrapper } from "./PaymentsEthWrapper";
import { InputValidationUI } from "./PaymentsInputValidationUI";
import {
  PaymentErrorText,
  PaymentTermsText,
  PaymentEmailConfirmationText,
  EnoughETHInWalletText,
  PaymentEmailPrepopulatedText,
} from "./PaymentsTextComponents";
import { INPUT_STATE } from "./types";
import { Checkbox, CheckboxSizes } from "../input";

export interface PaymentsEthFormProps {
  postId: string;
  etherToSpend: number;
  usdToSpend: number;
  shouldPublicize: boolean;
  newsroomName: string;
  paymentAddress: EthAddress;
  userAddress?: EthAddress;
  userEmail?: string;
  userChannelID?: string;
  savePayment: MutationFunc;
  setEmail: MutationFunc;
  handlePaymentSuccess(userSubmittedEmail: boolean, didSaveEmail: boolean, etherToSpend: number): void;
  handleEditPaymentType(): void;
  handlePaymentInProgress(ethPaymentInProgress: boolean, waitingForConfirmation: boolean): void;
}

export interface PaymentsEthFormState {
  email: string;
  emailState: string;
  saveEmailState: string;
  isPaymentError: boolean;
  wasEmailPrepopulated: boolean;
  promptSaveEmail: boolean;
  shouldSaveEmailToAccount: boolean;
  shouldAddEmailToMailingList: boolean;
}

export class PaymentsEthForm extends React.Component<PaymentsEthFormProps, PaymentsEthFormState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: PaymentsEthFormProps) {
    super(props);
    this.state = {
      email: this.props.userEmail || "",
      promptSaveEmail: !props.userEmail && props.userChannelID ? true : false,
      wasEmailPrepopulated: this.props.userEmail ? true : false,
      emailState: INPUT_STATE.EMPTY,
      saveEmailState: INPUT_STATE.EMPTY,
      isPaymentError: false,
      shouldSaveEmailToAccount: true,
      shouldAddEmailToMailingList: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <PaymentsEthWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          etherToSpend={this.props.etherToSpend}
          usdToSpend={this.props.usdToSpend}
        >
          <EnoughETHInWalletText />
          {this.state.wasEmailPrepopulated && <PaymentEmailPrepopulatedText email={this.state.email} />}
          {!this.state.wasEmailPrepopulated && (
            <>
              <PaymentInputLabel>Email address (optional)</PaymentInputLabel>
              <InputValidationUI inputState={this.state.emailState}>
                <input
                  defaultValue={this.state.email}
                  id="email"
                  name="email"
                  type="email"
                  maxLength={254}
                  onBlur={() => this.handleOnBlur(event)}
                  onChange={() => this.handleOnChange(event)}
                />
                <PaymentEmailConfirmationText />
              </InputValidationUI>
            </>
          )}
        </PaymentsEthWrapper>
        {this.state.promptSaveEmail && this.state.saveEmailState === INPUT_STATE.VALID && (
          <>
            <CheckboxContainer>
              <CheckboxSection>
                <label>
                  <Checkbox
                    size={CheckboxSizes.SMALL}
                    checked={this.state.shouldSaveEmailToAccount}
                    onClick={this.toggleShouldSaveEmailToAccount}
                  />
                  <CheckboxLabel>Save my email to my Civil account.</CheckboxLabel>
                </label>
              </CheckboxSection>
            </CheckboxContainer>
            <CheckboxContainer>
              <CheckboxSection>
                <label>
                  <Checkbox
                    size={CheckboxSizes.SMALL}
                    checked={this.state.shouldAddEmailToMailingList}
                    onClick={this.toggleShouldAddEmailToMailingList}
                  />
                  <CheckboxLabel>Receive the Civil newsletter to your inbox.</CheckboxLabel>
                </label>
              </CheckboxSection>
            </CheckboxContainer>
          </>
        )}
        <TransactionButtonNoModal
          transactions={[
            {
              preTransaction: this.saveEmail,
              transaction: this.sendPayment,
              handleTransactionHash: this.handleTransactionHash,
              onTransactionError: this.onTransactionError,
              postTransaction: this.postTransaction,
            },
          ]}
          disabled={this.state.emailState === INPUT_STATE.INVALID}
        >
          Complete Boost
        </TransactionButtonNoModal>
        {this.state.isPaymentError && <PaymentErrorText />}
        <PaymentTerms>
          <PaymentTermsText />
        </PaymentTerms>
      </>
    );
  }

  private toggleShouldSaveEmailToAccount = () => {
    this.setState({ shouldSaveEmailToAccount: !this.state.shouldSaveEmailToAccount });
  };

  private toggleShouldAddEmailToMailingList = () => {
    this.setState({ shouldAddEmailToMailingList: !this.state.shouldAddEmailToMailingList });
  };

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

  private handleOnChange = (event: any) => {
    const state = event.target.id;
    const value = event.target.value;

    switch (state) {
      case "email":
        const validEmail = isValidEmail(event.target.value);
        validEmail
          ? this.setState({ email: value, saveEmailState: INPUT_STATE.VALID, emailState: INPUT_STATE.VALID })
          : this.setState({ saveEmailState: INPUT_STATE.INVALID });
        if (value === "") {
          this.setState({ email: value, emailState: INPUT_STATE.VALID });
        }
        break;
      default:
        break;
    }
  };

  private saveEmail = async (): Promise<void> => {
    if (
      this.state.promptSaveEmail &&
      this.state.emailState === INPUT_STATE.VALID &&
      this.state.shouldSaveEmailToAccount
    ) {
      const variables = {
        input: {
          emailAddress: this.state.email,
          channelID: this.props.userChannelID,
          addToMailing: this.state.shouldAddEmailToMailingList,
        },
      };
      await this.props.setEmail({
        variables,
      });
    }
  };

  private sendPayment = async (): Promise<TwoStepEthTransaction<any> | void> => {
    this.context.fireAnalyticsEvent("tips", "start submit ETH support", this.props.postId, this.props.usdToSpend);
    this.props.handlePaymentInProgress(true, true);
    if (this.context.civil) {
      return this.context.civil.simplePayment(this.props.paymentAddress, this.props.etherToSpend.toString());
    }
  };

  private handleTransactionHash = async (txHash: TxHash) => {
    this.context.fireAnalyticsEvent("tips", "ETH support submitted", this.props.postId, this.props.usdToSpend);
    this.props.handlePaymentInProgress(true, false);
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
          payerChannelID: this.props.userChannelID,
        },
      },
    });
  };

  private onTransactionError = (err: string) => {
    this.context.fireAnalyticsEvent("tips", "ETH support rejected", this.props.postId, this.props.usdToSpend);
    this.setState({ isPaymentError: true });
    this.props.handlePaymentInProgress(false, false);
  };

  private postTransaction = () => {
    this.context.fireAnalyticsEvent("tips", "ETH support confirmed", this.props.postId, this.props.usdToSpend);
    const didSaveEmail =
      this.state.promptSaveEmail && this.state.email && this.state.shouldSaveEmailToAccount ? true : false;
    this.props.handlePaymentSuccess(this.state.email !== "" && true, didSaveEmail, this.props.etherToSpend);
  };
}
