import * as React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFunc } from "react-apollo";
import { Civil, EthAddress } from "@joincivil/core";
import { EthSignedMessage } from "@joincivil/typescript-types";
import {
  Transaction,
  TransactionButtonNoModal,
  MetaMaskLogoButton,
  ManagerSectionHeading,
  MetaMaskModal,
  ModalHeading,
  metaMaskSignImgUrl,
} from "../../";

export interface AccountEthAuthProps {
  civil: Civil;
  buttonText?: string;
  buttonOnly?: boolean;
  onAuthenticated?(address: EthAddress): void;
}

export interface AccountEthAuthState {
  errorMessage?: string;
  isWaitingSignatureOpen?: boolean;
  isSignRejectionOpen?: boolean;
}

const setEthAddressMutation = gql`
  mutation($input: UserSignatureInput!) {
    userSetEthAddress(input: $input)
  }
`;
const userEthAddressQuery = gql`
  query {
    currentUser {
      ethAddress
    }
  }
`;

export class AccountEthAuth extends React.Component<AccountEthAuthProps, AccountEthAuthState> {
  private _isMounted?: boolean;

  constructor(props: AccountEthAuthProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    if (this.props.buttonOnly) {
      return this.renderTransactionUI();
    }

    return (
      <>
        <ManagerSectionHeading>Log into Civil with your crypto wallet</ManagerSectionHeading>
        <p>
          Almost there! To set up your Civil account, you need to authenticate your account with a signature. This is
          similar to signing in with a password. It verifies your account with your crypto wallet.
        </p>

        <div>
          <p>MetaMask will open a new window, and will require you to sign a message.</p>
          {this.renderTransactionUI()}
          <img src={metaMaskSignImgUrl} />
        </div>
      </>
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
        mutation={setEthAddressMutation}
        update={(cache, { data: { userSetEthAddress } }) => {
          cache.writeQuery({
            query: userEthAddressQuery,
            data: {
              currentUser: {
                ethAddress: userSetEthAddress,
                __typename: "User",
              },
            },
          });
        }}
      >
        {userSetEthAddress => (
          <>
            <TransactionButtonNoModal
              transactions={this.signTransactions(userSetEthAddress)}
              Button={props => {
                return (
                  <MetaMaskLogoButton onClick={props.onClick}>
                    {this.props.buttonText || "Open MetaMask"}
                  </MetaMaskLogoButton>
                );
              }}
            />

            {this.renderWaitingSignModal()}
            {this.renderSignRejectionModal(userSetEthAddress)}
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

  private renderSignRejectionModal(userSetEthAddress: MutationFunc): JSX.Element | null {
    if (!this.state.isSignRejectionOpen) {
      return null;
    }

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText="To authenticate that you own your wallet address, you need to sign the message in your MetaMask wallet."
        cancelTransaction={this.cancelTransaction}
        denialRestartTransactions={this.signTransactions(userSetEthAddress)}
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

  private signTransactions = (userSetEthAddress: MutationFunc): Transaction[] => {
    return [
      {
        transaction: async (): Promise<EthSignedMessage> => {
          this.setState({ isWaitingSignatureOpen: true, isSignRejectionOpen: false, errorMessage: undefined });
          const message = "I control this address @ " + new Date().toISOString();
          return this.props.civil!.signMessage(message);
        },
        postTransaction: async (sig: EthSignedMessage): Promise<void> => {
          try {
            delete sig.rawMessage; // gql endpoint doesn't want this and errors out
            const res = await userSetEthAddress({
              variables: {
                input: sig,
              },
            });

            if (res && res.data && res.data.userSetEthAddress) {
              if (this.props.onAuthenticated) {
                this.props.onAuthenticated(sig.signer);
              }
              if (this._isMounted) {
                // A bit of an antipattern, but cancelling async/await is hard
                this.setState({ isWaitingSignatureOpen: false });
              }
            } else {
              console.error("Failed to validate and save ETH address. Response:", res);
              throw Error("Failed to validate and save ETH address");
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
