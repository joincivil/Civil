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
  fonts,
  colors,
} from "@joincivil/components";
import { prepareConstitutionSignMessage, hashContent } from "@joincivil/utils";
import { Civil, EthAddress, CharterData } from "@joincivil/core";
import { Map } from "immutable";
import styled from "styled-components";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { EthSignedMessage, TxHash } from "@joincivil/typescript-types";
import { IpfsObject } from "./Newsroom";
import { toBuffer } from "ethereumjs-util";
import { fetchNewsroom } from "./actionCreators";

const CheckWrapper = styled.span`
  margin-right: 8px;
`;

const ConstitutionContainer = styled.div`
  height: 462px;
  overflow-y: scroll;
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  margin-bottom: 38px;
  h2 {
    font-size: 32px;
    font-weight: 200;
    letter-spacing: -0.67px;
    line-height: 36px;
    font-family: ${fonts.SERIF};
    border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
    padding: 31px 23px;
    margin-top: 0;
  }
  h4 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    font-family: ${fonts.SANS_SERIF};
  }
`;

const Constitution = styled.div`
  padding: 20px 93px 50px 15px;
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 26px;
  p {
    font-size: 16px;
    line-height: 26px;
  }
`;

export interface SignConstitutionReduxProps {
  charter: Partial<CharterData>;
  government?: Map<string, string>;
  newsroomAdress?: EthAddress;
  ipfs?: IpfsObject;
  newsroom?: any;
  updateCharter(charter: Partial<CharterData>): void;
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

  public componentDidUpdate(prevProps: SignConstitutionReduxProps): void {
    if (!this.state.agreedToConstitution) {
      this.setState({
        agreedToConstitution: !!prevProps.charter!.signatures && !!prevProps.charter!.signatures!.length, // TODO, check if your signature is here
      });
    }
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
        <ModalHeading>Waiting for you to sign in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderWaitingPublishModal(): JSX.Element | null {
    if (!this.state.isWaitingPublishModalOpen) {
      return null;
    }
    return (
      <MetaMaskModal
        waiting={true}
        signing={true}
        cancelTransaction={() => this.cancelTransaction()}
        startTransaction={() => this.startTransaction()}
      >
        <MetaMaskStepCounter>Step 2 of 2</MetaMaskStepCounter>
        <ModalHeading>Waiting for you to confirm the transaction in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderMetaMaskRejectionModal(): JSX.Element | null {
    if (!this.state.metaMaskRejectionModal) {
      return null;
    }
    const message = "Your signature was not created";

    const denialMessage =
      "To sign the constitution, you need to confirm in your MetaMask wallet. You will not be able to proceed without signing the constitution.";

    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <MetaMaskModal
            waiting={false}
            denied={true}
            denialText={denialMessage}
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

    const denialMessage =
      "To save your charter to your newsroom smart contract, you need to confirm in your MetaMask wallet. You will not be able to proceed without saving.";

    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <MetaMaskModal
            waiting={false}
            denied={true}
            denialText={denialMessage}
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
    const content = this.props.government ? this.props.government.get("constitutionContent") : "";
    return (
      <>
        <StepHeader>Sign the Civil Constitution</StepHeader>
        <StepDescription>
          Signing the Civil Constitution is an acknowledgement that you agree to abide by its set of ethical standards.
        </StepDescription>
        <StepFormSection>
          <h4>Civil Constitution</h4>
          <StepDescription>Please read and sign the Civil Constitution below</StepDescription>
          <ConstitutionContainer>
            <h2>Civil Constitution</h2>
            <Constitution dangerouslySetInnerHTML={{ __html: content }} />
          </ConstitutionContainer>
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
                    disabled={!this.state.agreedToConstitution}
                    Button={props => {
                      return (
                        <MetaMaskLogoButton disabled={props.disabled} onClick={props.onClick}>
                          Complete Your Charter
                        </MetaMaskLogoButton>
                      );
                    }}
                    transactions={this.getTransactions(value.civil!)}
                  />
                </>
              );
            }}
          </CivilContext.Consumer>
          {this.renderPreSignModal()}
          {this.renderWaitingSignModal()}
          {this.renderWaitingPublishModal()}
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
          const constitutionHash = this.props.government ? this.props.government!.get("constitutionHash") : "[NONE]";
          return civil.signMessage(prepareConstitutionSignMessage(this.props.newsroomAdress!, constitutionHash));
        },
        postTransaction: async (sig: EthSignedMessage): Promise<void> => {
          const { signature, message, signer } = sig;
          const signatures = this.props.charter.signatures || [];
          signatures.push({ signature, message, signer });
          const charter = { ...this.props.charter, signatures };
          this.props.updateCharter(charter);
          this.setState({
            isWaitingSignatureOpen: false,
          });
        },
        handleTransactionError: (err: Error) => {
          this.setState({ isWaitingSignatureOpen: false });
          if (err.message.indexOf("Error: MetaMask Message Signature: User denied message signature.") !== -1) {
            this.setState({ metaMaskRejectionModal: true });
          } else {
            console.error("Transaction failed:", err);
            alert("Transaction failed: " + err.message);
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
          const charter = JSON.stringify(this.props.charter);

          let uri;
          let contentHash;
          if (this.props.ipfs) {
            const files = await this.props.ipfs!.add(toBuffer(charter), {
              hash: "keccak-256",
              pin: true,
            });
            contentHash = hashContent(charter);
            uri = `ipfs://${files[0].path}`;
          } else {
            const header = await civil.publishContent(charter, { hash: "keccak-256" });
            uri = header.uri;
            contentHash = header.contentHash;
          }
          return this.props.newsroom.updateRevisionURIAndHash(0, uri, contentHash);
        },
        handleTransactionHash: (hash: TxHash) => {
          this.setState({ isWaitingPublishModalOpen: false });
        },
        postTransaction: () => {
          this.props.dispatch!(fetchNewsroom(this.props.newsroomAdress!));
        },
        handleTransactionError: (err: Error) => {
          this.setState({ isWaitingPublishModalOpen: false });
          if (err.message.indexOf("Error: MetaMask Message Signature: User denied message signature.") !== -1) {
            this.setState({ metaMaskPublishRejectionModal: true });
          } else {
            console.error("Transaction failed:", err);
            alert("Transaction failed: " + err.message);
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
  const newsroom = state.newsrooms.get(ownProps.newsroomAdress) || {};

  return {
    ...ownProps,
    government: newsroomGovernment,
    newsroom: newsroom.newsroom,
  };
};

export const SignConstitution = connect(mapStateToProps)(SignConstitutionComponent);
