import * as React from "react";
import { MetaMaskLogoButton } from "../MetaMaskLogoButton";
import { MetaMaskModal } from "../MetaMaskModal";
import { ModalHeading } from "../ModalContent";
import { CivilContext, ICivilContext } from "../context";

export interface EthereumTransactionInfo {
  hash: string;
}

export interface EthereumTransactionButtonProps {
  disabled: boolean;
  modalHeading: string;
  execute(): Promise<EthereumTransactionInfo>;
  onComplete(): any;
}
export interface EthereumTransactionButtonState {
  inProgress: boolean;
  waiting: boolean;
  rejected: boolean;
  complete: boolean;
}
export class EthereumTransactionButton extends React.Component<
  EthereumTransactionButtonProps,
  EthereumTransactionButtonState
> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  public constructor(props: EthereumTransactionButtonProps) {
    super(props);
    this.state = { inProgress: false, waiting: false, rejected: false, complete: false };
  }
  public render(): JSX.Element {
    return (
      <>
        <MetaMaskLogoButton disabled={this.props.disabled} onClick={async () => this.handleTransaction()}>
          {this.props.children}
        </MetaMaskLogoButton>
        {this.state.inProgress ? (
          <MetaMaskModal
            waiting={this.state.waiting}
            denied={this.state.rejected}
            cancelTransaction={() => this.cancelTransaction()}
          >
            <ModalHeading>{this.props.modalHeading}</ModalHeading>
          </MetaMaskModal>
        ) : null}
      </>
    );
  }

  private async handleTransaction(): Promise<void> {
    this.setState({ inProgress: true, waiting: true, rejected: false });
    try {
      const tx = await this.props.execute();
      await this.context.waitForTx((tx as any).hash);
      this.setState({ inProgress: false, waiting: false, rejected: false });
      this.props.onComplete();
    } catch (err) {
      console.log("error in transaction", err);
      this.setState({ inProgress: true, waiting: false, rejected: true });
    }
  }

  private cancelTransaction(): void {
    this.setState({ inProgress: false, waiting: false, rejected: true });
  }
}
