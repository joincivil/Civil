import * as React from "react";
import { Civil, EthAddress } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { userSetEthAddress } from "@joincivil/utils";
import {
  Transaction,
  TransactionButtonNoModal,
  MetaMaskLogoButton,
  ManagerSectionHeading,
  MetaMaskModal,
  ModalHeading,
} from "../../";
import * as metaMaskSignatureReqUrl from "../../images/img-metamaskmodal-new-signature.png";

export interface AccountEthAuthProps {
  civil: Civil;
  onAuthenticated?(address: EthAddress): void;
}

export interface AccountEthAuthState {
  errorMessage?: string;
  isWaitingSignatureOpen?: boolean;
  isSignRejectionOpen?: boolean;
}

export class AccountEthAuth extends React.Component<AccountEthAuthProps, AccountEthAuthState> {
  constructor(props: AccountEthAuthProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return (
      <>
        <ManagerSectionHeading>Log into Civil with your crypto wallet</ManagerSectionHeading>
        <p>
          Almost there! To set up your Civil account, you need to authenticate your account with a signature. This is
          similar to signing in with a password. It verifies your account with your crypto wallet.
        </p>

        <div>
          <p>MetaMask will open a new window, and will require you to sign a message.</p>
          <TransactionButtonNoModal
            transactions={this.signTransactions()}
            Button={props => {
              return <MetaMaskLogoButton onClick={props.onClick}>Open MetaMask</MetaMaskLogoButton>;
            }}
          />
          <img src={metaMaskSignatureReqUrl} />
        </div>

        {this.renderWaitingSignModal()}
        {this.renderSignRejectionModal()}
        {this.renderSaveErrorModal()}
      </>
    );
  }

  private renderWaitingSignModal(): JSX.Element | null {
    if (!this.state.isWaitingSignatureOpen) {
      return null;
    }
    return (
      <MetaMaskModal waiting={true} signing={true} cancelTransaction={this.cancelTransaction}>
        <ModalHeading>Please sign the text in MetaMask to authenticate</ModalHeading>
      </MetaMaskModal>
    );
  }

  private renderSignRejectionModal(): JSX.Element | null {
    if (!this.state.isSignRejectionOpen) {
      return null;
    }

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText="To authenticate that you own your wallet address, you need to sign the message in your MetaMask wallet."
        cancelTransaction={this.cancelTransaction}
        denialRestartTransactions={this.signTransactions()}
      >
        <ModalHeading>Failed to authenticate your wallet address</ModalHeading>
      </MetaMaskModal>
    );
  }

  private renderSaveErrorModal(): JSX.Element | null {
    if (!this.state.errorMessage) {
      return null;
    }

    return (
      <MetaMaskModal
        alert={true}
        bodyText={`Something went wrong when authenticating and saving your wallet address (${
          this.state.errorMessage
        }). Please try again later.`}
        cancelTransaction={this.cancelTransaction}
      >
        <ModalHeading>Failed to save your wallet address</ModalHeading>
      </MetaMaskModal>
    );
  }

  private signTransactions = (): Transaction[] => {
    return [
      {
        transaction: async (): Promise<EthSignedMessage> => {
          this.setState({ isWaitingSignatureOpen: true, isSignRejectionOpen: false, errorMessage: undefined });
          const message = "I control this address @ " + new Date().toISOString();
          return this.props.civil!.signMessage(message);
        },
        postTransaction: async (sig: EthSignedMessage): Promise<void> => {
          try {
            await userSetEthAddress(sig);
            this.setState({ isWaitingSignatureOpen: false });
            if (this.props.onAuthenticated) {
              this.props.onAuthenticated(sig.signer);
            }
          } catch (err) {
            this.setState({
              isWaitingSignatureOpen: false,
              errorMessage: err,
            });
          }
        },
        handleTransactionError: (err: Error) => {
          this.setState({ isWaitingSignatureOpen: false });
          if (err.message.indexOf("Error: MetaMask Message Signature: User denied message signature.") !== -1) {
            this.setState({ isSignRejectionOpen: true });
          } else {
            console.error("Transaction failed:", err);
            this.setState({
              errorMessage: "Transaction failed: " + err.message,
            });
          }
        },
      },
    ];
  };

  private cancelTransaction = () => {
    this.setState({
      isWaitingSignatureOpen: false,
      isSignRejectionOpen: false,
      errorMessage: undefined,
    });
  };
}
