import * as React from "react";
import { isValidEmail } from "@joincivil/utils";
import {
  BoostPayFormFlex,
  BoostPayFormWrapper,
  SubmitInstructions,
  SubmitWarning,
  BoostUserInfoForm,
} from "../BoostStyledComponents";
import {
  TransactionButton,
  TransactionButtonModalContentComponentsProps,
  progressModalStates,
  CivilContext,
  ICivilContext,
  RENDER_CONTEXT,
} from "@joincivil/components";
import { InputValidationUI, INPUT_STATE } from "./InputValidationUI";
import { TwoStepEthTransaction } from "@joincivil/core";
import { EthAddress, TxHash } from "@joincivil/typescript-types";
import { PaymentInProgressModalText, PaymentSuccessModalText, PaymentErrorModalText } from "../BoostTextComponents";
import { MutationFunc } from "react-apollo";
import { urlConstants } from "../../urlConstants";

export interface BoostPayFormEthProps {
  boostId: string;
  etherToSpend: number;
  usdToSpend: number;
  newsroomName: string;
  title: string;
  paymentAddr: EthAddress;
  savePayment: MutationFunc;
  handlePaymentSuccess(): void;
}

export interface BoostPayFormEthState {
  email: string;
  emailState: string;
  fromAddr?: EthAddress;
}

export class BoostPayFormEth extends React.Component<BoostPayFormEthProps, BoostPayFormEthState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: BoostPayFormEthProps) {
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
      [progressModalStates.IN_PROGRESS]: <PaymentInProgressModalText />,
      [progressModalStates.SUCCESS]: (
        <PaymentSuccessModalText
          newsroomName={this.props.newsroomName}
          etherToSpend={this.props.etherToSpend}
          usdToSpend={this.props.usdToSpend}
          handlePaymentSuccess={this.props.handlePaymentSuccess}
          boostId={this.props.boostId}
          newsroom={this.props.newsroomName}
          title={this.props.title}
        />
      ),
      [progressModalStates.ERROR]: <PaymentErrorModalText />,
    };

    return (
      <BoostPayFormWrapper>
        <form>
          <BoostUserInfoForm>
            {this.context.renderContext !== RENDER_CONTEXT.EMBED && <label>Email (optional)</label>}
            <InputValidationUI inputState={this.state.emailState} width={"500px"}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={this.context.renderContext === RENDER_CONTEXT.EMBED ? "Email (optional)" : undefined}
                maxLength={254}
                onBlur={() => this.handleOnBlur(event)}
              />
            </InputValidationUI>
          </BoostUserInfoForm>
          <BoostPayFormFlex>
            <SubmitInstructions>
              All proceeds of the Boost go directly to the newsroom. If a Boost goal is not met, the proceeds will still
              go to fund the selected newsroom. Refunds are not possible.
            </SubmitInstructions>
            <div>
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
                Support this Boost
              </TransactionButton>
              <SubmitWarning>
                By sending a Boost, you agree to Civil’s <a href={urlConstants.TERMS}>Terms of Use</a> and{" "}
                <a href={urlConstants.PRIVACY_POLICY}>Privacy Policy</a>. Civil does not charge any fees for this
                transaction. There are small fees charged by the Ethereum network.
              </SubmitWarning>
            </div>
          </BoostPayFormFlex>
        </form>
      </BoostPayFormWrapper>
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
    this.context.fireAnalyticsEvent("boosts", "start submit ETH support", this.props.boostId, this.props.usdToSpend);
    if (this.context.civil) {
      return this.context.civil.simplePayment(this.props.paymentAddr, this.props.etherToSpend.toString());
    }
  };

  private handleTransactionHash = async (txHash: TxHash) => {
    this.context.fireAnalyticsEvent("boosts", "ETH support submitted", this.props.boostId, this.props.usdToSpend);
    await this.props.savePayment({
      variables: {
        postID: this.props.boostId,
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
    this.context.fireAnalyticsEvent("boosts", "ETH support rejected", this.props.boostId, this.props.usdToSpend);
  };

  private postTransaction = () => {
    this.context.fireAnalyticsEvent("boosts", "ETH support confirmed", this.props.boostId, this.props.usdToSpend);
  };
}
