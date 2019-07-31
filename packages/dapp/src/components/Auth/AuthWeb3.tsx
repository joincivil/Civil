import * as React from "react";
import { Mutation, MutationFunc } from "react-apollo";
import { Civil, EthAddress } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { setApolloSession, clearApolloSession, getCurrentUserQuery } from "@joincivil/utils";
import {
  CivilContext,
  ICivilContext,
  Transaction,
  TransactionButtonNoModal,
  CardTransactionButton,
  MetaMaskModal,
  ModalHeading,
} from "@joincivil/components";

export interface AuthWeb3Props {
  authMutation: any;
  messagePrefix: string;
  header?: JSX.Element | string;
  buttonText?: string | JSX.Element;
  buttonOnly?: boolean;
  onAuthenticated?(address: EthAddress): void;
  onAuthenticationContinue?(isNewUser?: boolean, redirectUrl?: string): void;
}

export interface AuthWeb3State {
  errorMessage?: string;
  isWaitingSignatureOpen?: boolean;
  isSignRejectionOpen?: boolean;
  userAddress?: EthAddress;
}

// TODO(jon): This is a simple function to handle the auth behavior.
// We should probably abstract this into a AuthManager class?
function loginUser(civil: Civil, sessionData: any, currAccount?: EthAddress): void {
  setApolloSession(sessionData);

  const logoutUser = (account?: EthAddress) => {
    if (!account || account !== currAccount) {
      // TODO(jon): Should we display some type of message/modal/toaster to the user that indicates they've been signed out?
      clearApolloSession();
    }
  };

  civil.accountStream.subscribe(logoutUser);
}

class AuthWeb3 extends React.Component<AuthWeb3Props, AuthWeb3State> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  private _isMounted?: boolean;

  constructor(props: AuthWeb3Props) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {
    this._isMounted = true;
  }
  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public render(): JSX.Element {
    const { civil } = this.context;
    const { userAddress } = this.state;

    return (
      <Mutation
        mutation={this.props.authMutation}
        refetchQueries={({ data: { authWeb3 } }) => {
          loginUser(civil, authWeb3, userAddress);
          return [{ query: getCurrentUserQuery }];
        }}
      >
        {authWeb3Mutate => (
          <>
            <TransactionButtonNoModal
              transactions={this.signTransactions(authWeb3Mutate)}
              Button={props => {
                return (
                  <CardTransactionButton onClick={props.onClick}>
                    {this.props.buttonText || "Open MetaMask"}
                  </CardTransactionButton>
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
            this.setState({ userAddress: sig.signer });

            const res = await authWeb3Mutate({
              variables: {
                input: sig,
              },
            });

            if (res && res.data && res.data.authWeb3) {
              if (this.props.onAuthenticated) {
                this.props.onAuthenticated(sig.signer);
              }
              if (this.props.onAuthenticationContinue) {
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
