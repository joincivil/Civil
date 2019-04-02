import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  StepDescription,
  StepFormSection,
  Checkbox,
  MetaMaskLogoButton,
  MetaMaskModal,
  ModalHeading,
  TransactionButtonNoModal,
  Transaction,
  colors,
  fonts,
  OBSectionHeader,
  OBSectionDescription,
  HollowGreenCheck,
} from "@joincivil/components";
import { prepareConstitutionSignMessage } from "@joincivil/utils";
import { Civil, EthAddress, CharterData } from "@joincivil/core";
import { Map } from "immutable";
import styled from "styled-components";
import { CivilContext, CivilContextValue } from "../CivilContext";
import { EthSignedMessage } from "@joincivil/typescript-types";
import { IpfsObject } from "../Newsroom";
import { StyledHr, StepSectionCounter } from "../styledComponents";
import { LearnMoreButton } from "./LearnMoreButton";

const CheckWrapper = styled.span`
  margin-right: 8px;
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
  startTransaction(): void;
  cancelTransaction(): void;
}

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
  }
`;

const Constitution = styled.div`
  padding: 20px 93px 50px 15px;
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 26px;
  h2 {
    border: none;
    font-family: ${fonts.SANS_SERIF};
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    margin-top: 32px;
    padding: 0;
    &:first-child {
      margin-top: 0;
    }
  }
  h4 {
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    font-family: ${fonts.SANS_SERIF};
  }
  p {
    font-size: 16px;
    line-height: 26px;
  }
  a {
    cursor: pointer;
  }
`;

const StyledCheck = styled(HollowGreenCheck)`
  margin-right: 10px;
`;

const SignedMessage = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
`;

class SignConstitutionComponent extends React.Component<
  DispatchProp<any> & SignConstitutionReduxProps,
  SignConstitutionState
> {
  constructor(props: SignConstitutionReduxProps) {
    super(props);
    this.state = {
      isNewsroomOwner: false,
      preSignModalOpen: false,
      isWaitingSignatureOpen: false,
      metaMaskRejectionModal: false,
      agreedToConstitution: !!(this.props.charter.signatures && this.props.charter.signatures.length),
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
        <ModalHeading>Waiting for you to sign in MetaMask</ModalHeading>
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
            <ModalHeading>{message}</ModalHeading>
          </MetaMaskModal>
        )}
      </CivilContext.Consumer>
    );
  }

  public render(): JSX.Element {
    const content = this.props.government ? this.props.government.get("constitutionContent") : "";
    const hasSigned = this.props.charter.signatures && this.props.charter.signatures.length;
    return (
      <>
        <OBSectionHeader>Review the Civil Constitution</OBSectionHeader>
        <OBSectionDescription>
          The Civil Constitution reflects the mission, purpose and values of ethical journalism on the Civil network.
          All newsrooms are expected to comply with its standards and may be challenged if they are in violation of its
          principles.{" "}
        </OBSectionDescription>
        <LearnMoreButton />
        <StyledHr />
        <StepSectionCounter>Step 4 of 4: Signing</StepSectionCounter>
        <StepDescription>
          Pledging to the Civil Constitution is an acknowledgement that you agree to abide by its set of ethical
          standards.
        </StepDescription>
        <ConstitutionContainer>
          <h2>Civil Constitution</h2>
          <Constitution dangerouslySetInnerHTML={{ __html: content }} />
        </ConstitutionContainer>
        <p>
          <CheckWrapper>
            <Checkbox
              id="agree_to_constitution"
              checked={this.state.agreedToConstitution}
              onClick={() => this.setState({ agreedToConstitution: !this.state.agreedToConstitution })}
            />
          </CheckWrapper>{" "}
          <label htmlFor="agree_to_constitution">
            I agree to abide by the Civil Community's ethical principles as described in the Civil Constitution
          </label>
        </p>
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
                  {hasSigned ? (
                    <SignedMessage>
                      {" "}
                      <StyledCheck /> <div>Civil Constitution Signed</div>
                    </SignedMessage>
                  ) : (
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
                  )}
                </>
              );
            }}
          </CivilContext.Consumer>
          {this.renderPreSignModal()}
          {this.renderWaitingSignModal()}
          {this.renderMetaMaskRejectionModal()}
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
          return civil.signMessage(prepareConstitutionSignMessage(this.props.charter.name!, constitutionHash));
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
        handleTransactionError: (err?: Error) => {
          this.setState({ isWaitingSignatureOpen: false });
          if (err && err.message.indexOf("Error: MetaMask Message Signature: User denied message signature.") !== -1) {
            this.setState({ metaMaskRejectionModal: true });
          } else {
            console.error("Transaction failed:", err);
            alert("Transaction failed. Error: " + (err && err.message));
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
