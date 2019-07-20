import * as React from "react";
import { Mutation, MutationFunc } from "react-apollo";
import { EthAddress } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { setApolloSession, getCurrentUserQuery } from "@joincivil/utils";
import {
  CivilContext,
  ICivilContext,
  Transaction,
  TransactionButtonNoModal,
  MetaMaskLogoButton,
  ManagerSectionHeading,
  MetaMaskModal,
  ModalHeading,
} from "@joincivil/components";
import { StyledPageContentWithPadding } from "../utility/styledComponents";

export interface AuthWeb3Props {
  authMutation: any;
  messagePrefix: string;
  header?: JSX.Element | string;
  buttonText?: string;
  buttonOnly?: boolean;
  onAuthenticated?(address: EthAddress): void;
  onAuthenticationContinue?(isNewUser?: boolean, redirectUrl?: string): void;
}

export interface AuthWeb3State {
  errorMessage?: string;
  isWaitingSignatureOpen?: boolean;
  isSignRejectionOpen?: boolean;
}

class AuthWeb3 extends React.Component<AuthWeb3Props, AuthWeb3State> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  private _isMounted?: boolean;

  constructor(props: AuthWeb3Props) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    if (this.props.buttonOnly) {
      return this.renderTransactionUI();
    }

    const header = this.props.header || <>Log into Civil with your crypto wallet</>;

    return (
      <StyledPageContentWithPadding>
        <ManagerSectionHeading>{header}</ManagerSectionHeading>
        <div>
          <p>MetaMask will open a new window, and will require you to sign a message.</p>
          {this.renderTransactionUI()}
        </div>
      </StyledPageContentWithPadding>
    );
  }

  public componentDidMount(): void {
    this._isMounted = true;
  }
  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  private renderTransactionUI(): JSX.Element {
    return (
      <Mutation
        mutation={this.props.authMutation}
        refetchQueries={({ data: { authWeb3 } }) => {
          setApolloSession(authWeb3);
          return [{ query: getCurrentUserQuery }];
        }}
      >
        {authWeb3Mutate => (
          <>
            <TransactionButtonNoModal
              transactions={this.signTransactions(authWeb3Mutate)}
              Button={props => {
                return (
                  <MetaMaskLogoButton onClick={props.onClick}>
                    {this.props.buttonText || "Open MetaMask"}
                  </MetaMaskLogoButton>
                );
              }}
            />

            {this.renderWaitingSignModal()}
            {this.renderSignRejectionModal(authWeb3Mutate)}
            {this.renderSaveErrorModal()}
          </>
        )}
      </Mutation>
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

  private renderSignRejectionModal(authWeb3Mutate: MutationFunc): JSX.Element | null {
    if (!this.state.isSignRejectionOpen) {
      return null;
    }

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText="To authenticate that you own your wallet address, you need to sign the message in your MetaMask wallet."
        cancelTransaction={this.cancelTransaction}
        denialRestartTransactions={this.signTransactions(authWeb3Mutate)}
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
        bodyText={`Something went wrong when authenticating your wallet address (${
          this.state.errorMessage
        }). Please try again later.`}
        cancelTransaction={this.cancelTransaction}
      >
        <ModalHeading>Failed to save your wallet address</ModalHeading>
      </MetaMaskModal>
    );
  }

  private signTransactions = (authWeb3Mutate: MutationFunc): Transaction[] => {
    const { civil } = this.context;

    return [
      {
        transaction: async (): Promise<EthSignedMessage> => {
          this.setState({ isWaitingSignatureOpen: true, isSignRejectionOpen: false, errorMessage: undefined });
          const message = `${this.props.messagePrefix} @ ${new Date().toISOString()}`;
          return civil!.signMessage(message);
        },
        postTransaction: async (sig: EthSignedMessage): Promise<void> => {
          try {
            delete sig.rawMessage; // gql endpoint doesn't want this and errors out

            const res = await authWeb3Mutate({
              variables: {
                input: sig,
              },
            });

            if (res && res.data && res.data.authWeb3) {
              console.log(this.props);
              if (this.props.onAuthenticated) {
                this.props.onAuthenticated(sig.signer);
              }
              if (this.props.onAuthenticationContinue) {
                console.log("auth continue");
                this.props.onAuthenticationContinue();
              }
              if (this._isMounted) {
                // A bit of an antipattern, but cancelling async/await is hard
                this.setState({ isWaitingSignatureOpen: false });
              }
            } else {
              console.error("Failed to validate and log in with ETH address. Response:", res);
              throw Error("Failed to validate and log in with ETH address");
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

export default AuthWeb3;
