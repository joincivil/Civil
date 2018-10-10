import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  StepHeader,
  StepDescription,
  StepFormSection,
  Checkbox,
  MetaMaskLogoButton,
  MetaMaskModal,
  ModalHeading,
  TransactionButtonNoModal,
  Transaction,
  MetaMaskStepCounter,
} from "@joincivil/components";
import { prepareConstitutionSignMessage, hashContent } from "@joincivil/utils";
import { Civil, EthAddress, CharterData } from "@joincivil/core";
import { Map } from "immutable";
import styled from "styled-components";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { EthSignedMessage, TxHash } from "@joincivil/typescript-types";
import { updateCharter } from "./actionCreators";
import { IpfsObject } from "./Newsroom";
import { toBuffer } from "ethereumjs-util";

const StyledLegalIframe = styled.iframe`
  border-width: 1px;
  height: 15rem;
  margin: 0 0 2rem;
  width: 100%;
`;

const CheckWrapper = styled.span`
  margin-right: 8px;
`;

export interface SignConstitutionReduxProps {
  government?: Map<string, string>;
  newsroomAdress?: EthAddress;
  savedCharter?: Partial<CharterData>;
  ipfs?: IpfsObject;
  newsroom?: any;
  saveCharter(charter: Partial<CharterData>): void;
}

export interface SignConstitutionState {
  isNewsroomOwner: boolean;
  agreedToConstitution: boolean;
  preSignModalOpen: boolean;
  isWaitingSignatureOpen: boolean;
  metaMaskRejectionModal: boolean;
  isWaitingPublishModalOpen: boolean;
  metaMaskPublishRejectionModal: boolean;
  startTransaction(): void;
  cancelTransaction(): void;
}

class SignConstitutionComponent extends React.Component<
  DispatchProp<any> & SignConstitutionReduxProps,
  SignConstitutionState
> {
  constructor(props: SignConstitutionReduxProps) {
    super(props);
    this.state = {
      isNewsroomOwner: false,
      agreedToConstitution: false,
      preSignModalOpen: false,
      isWaitingSignatureOpen: false,
      metaMaskRejectionModal: false,
      metaMaskPublishRejectionModal: false,
      isWaitingPublishModalOpen: false,
      startTransaction: () => {
        return;
      },
      cancelTransaction: () => {
        return;
      },
    };
  }

  public renderPreSignModal(): JSX.Element | null {
    if (!this.state.preSignModalOpen) {
      return null;
    }
    return (
      <MetaMaskModal
        waiting={false}
        signing={true}
        cancelTransaction={() => this.cancelTransaction()}
        startTransaction={() => this.startTransaction()}
      >
        <MetaMaskStepCounter>Step 1 of 2</MetaMaskStepCounter>
        <ModalHeading>To sign the Civil Constitution, please open MetaMask and sign the request.</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderWaitingSignModal(): JSX.Element | null {
    if (!this.state.isWaitingSignatureOpen) {
      return null;
    }
    return (
      <MetaMaskModal
        waiting={true}
        signing={true}
        cancelTransaction={() => this.cancelTransaction()}
        startTransaction={() => this.startTransaction()}
      >
        <MetaMaskStepCounter>Step 1 of 2</MetaMaskStepCounter>
        <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderMetaMaskRejectionModal(): JSX.Element | null {
    if (!this.state.metaMaskRejectionModal) {
      return null;
    }
    const message = "Your signature was not created";

    const denailMessage =
      "To sign the constitution, you need to confirm in your MetaMask wallet. You will not be able to proceed without signing the constitution.";

    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <MetaMaskModal
            waiting={false}
            denied={true}
            denialText={denailMessage}
            cancelTransaction={() => this.cancelTransaction()}
            denialRestartTransactions={this.getTransactions(value.civil!, true)}
          >
            <MetaMaskStepCounter>Step 1 of 2</MetaMaskStepCounter>
            <ModalHeading>{message}</ModalHeading>
          </MetaMaskModal>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderMetaMaskPublishRejectionModal(): JSX.Element | null {
    if (!this.state.metaMaskPublishRejectionModal) {
      return null;
    }
    const message = "Your charter was not saved to your newsroom smart contract.";

    const denailMessage =
      "To save your charter to your newsroom smart contract, you need to confirm in your MetaMask wallet. You will not be able to proceed without saving.";

    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <MetaMaskModal
            waiting={false}
            denied={true}
            denialText={denailMessage}
            cancelTransaction={() => this.cancelTransaction()}
            denialRestartTransactions={this.getPublishTransaction(value.civil!)}
          >
            <MetaMaskStepCounter>Step 2 of 2</MetaMaskStepCounter>
            <ModalHeading>{message}</ModalHeading>
          </MetaMaskModal>
        )}
      </CivilContext.Consumer>
    );
  }

  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Sign the Civil Constitution</StepHeader>
        <StepDescription>
          Signing the Civil Constitution is an acknowledgement that you agree to abide by its set of ethical standards.
        </StepDescription>
        <StepFormSection>
          <h4>Civil Constitution</h4>
          <StepDescription>Please read and sign the Civil Constitution below</StepDescription>
          <StyledLegalIframe src={this.props.government!.get("constitutionUri")} />
          <p>
            <CheckWrapper>
              <Checkbox
                checked={this.state.agreedToConstitution}
                onClick={() => this.setState({ agreedToConstitution: !this.state.agreedToConstitution })}
              />
            </CheckWrapper>{" "}
            I agree to abide by the Civil Community's ethical principles as described in the Civil Constitution
          </p>
        </StepFormSection>
        <StepFormSection>
          <CivilContext.Consumer>
            {(value: CivilContextValue) => {
              return (
                <>
                  <h4>Add signature and complete your charter</h4>
                  <StepDescription>
                    You will now cryptographically sign the constitution and add the signature to your charter and then
                    save the charter to your newsroom smart contract. You will see two windows: one to sign this message
                    and the other to confirm.
                  </StepDescription>
                  <TransactionButtonNoModal
                    Button={props => (
                      <MetaMaskLogoButton onClick={props.onClick}>Complete Your Charter</MetaMaskLogoButton>
                    )}
                    transactions={this.getTransactions(value.civil!)}
                  />
                </>
              );
            }}
          </CivilContext.Consumer>
          {this.renderPreSignModal()}
          {this.renderWaitingSignModal()}
          {this.renderMetaMaskRejectionModal()}
          {this.renderMetaMaskPublishRejectionModal()}
        </StepFormSection>
      </>
    );
  }
  private getTransactions = (civil: Civil, noPremodal?: boolean): Transaction[] => {
    return [
      {
        requireBeforeTransaction: noPremodal
          ? undefined
          : async (): Promise<any> => {
              return new Promise((res, rej) => {
                this.setState({
                  startTransaction: res,
                  cancelTransaction: rej,
                  preSignModalOpen: true,
                });
              });
            },
        transaction: async (): Promise<EthSignedMessage> => {
          this.setState({ isWaitingSignatureOpen: true });
          return civil.signMessage(
            prepareConstitutionSignMessage(this.props.newsroomAdress!, this.props.government!.get("constitutionHash")),
          );
        },
        postTransaction: async (sig: EthSignedMessage): Promise<void> => {
          const { signature, message, signer } = sig;
          const signatures = this.props.savedCharter!.signatures || [];
          signatures.push({ signature, message, signer });
          const charter = { ...this.props.savedCharter, signatures };
          this.props.dispatch!(updateCharter(this.props.newsroomAdress!, charter));
          this.props.saveCharter(charter);
          this.setState({ isWaitingSignatureOpen: false });
        },
        handleTransactionError: (err: Error) => {
          this.setState({ isWaitingSignatureOpen: false });
          if (err.message === "Error: MetaMask Message Signature: User denied message signature.") {
            this.setState({ metaMaskRejectionModal: true });
          }
        },
      },
      ...this.getPublishTransaction(civil),
    ];
  };

  private getPublishTransaction = (civil: Civil): Transaction[] => {
    return [
      {
        transaction: async () => {
          this.setState({ isWaitingPublishModalOpen: true });
          const charter = JSON.stringify(this.props.savedCharter);
          const files = await this.props.ipfs!.add(toBuffer(charter), {
            hash: "keccak-256",
            pin: true,
          });
          const hash = hashContent(charter);
          return this.props.newsroom.updateRevisionURIAndHash(0, `ipfs://${files[0].path}`, hash);
        },
        handleTransactionHash: (hash: TxHash) => {
          this.setState({ isWaitingPublishModalOpen: false });
        },
        handleTransactionError: (err: Error) => {
          this.setState({ isWaitingPublishModalOpen: false });
          if (err.message === "Error: MetaMask Message Signature: User denied message signature.") {
            this.setState({ metaMaskPublishRejectionModal: true });
          }
        },
      },
    ];
  };

  private cancelTransaction = () => {
    if (this.state.cancelTransaction) {
      this.state.cancelTransaction();
    }
    this.setState({
      cancelTransaction: () => {
        return;
      },
      startTransaction: () => {
        return;
      },
      preSignModalOpen: false,
    });
  };

  private startTransaction = () => {
    if (this.state.startTransaction) {
      this.state.startTransaction();
    }
    this.setState({
      cancelTransaction: () => {
        return;
      },
      startTransaction: () => {
        return;
      },
      preSignModalOpen: false,
      isWaitingSignatureOpen: true,
    });
  };
}

const mapStateToProps = (state: any, ownProps: SignConstitutionReduxProps): SignConstitutionReduxProps => {
  const { newsroomGovernment } = state;
  let charterFromState;
  const newsroom = state.newsrooms.get(ownProps.newsroomAdress);
  if (ownProps.newsroomAdress && newsroom) {
    charterFromState = state.newsrooms.get(ownProps.newsroomAdress).charter;
  }

  return {
    ...ownProps,
    government: newsroomGovernment,
    savedCharter: charterFromState || ownProps.savedCharter || {},
    newsroom: newsroom.newsroom,
  };
};

export const SignConstitution = connect(mapStateToProps)(SignConstitutionComponent);
