import {
  OBSectionHeader,
  OBSectionDescription,
  StepDescription,
  AddressWithCopyButton,
  Button,
  buttonSizes,
  TransactionButtonNoModal,
  fonts,
  GreenCheckMark,
  Modal,
  TextInput,
  MetaMaskModal,
  ModalHeading,
  Transaction,
  TransactionButtonModalFlowState,
  QuestionToolTip,
  colors,
  GasEstimate,
  ClipLoader,
} from "@joincivil/components";
import { Civil, IPFSProvider, EthAddress, TwoStepEthTransaction, TxHash, CharterData } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled, { StyledComponentClass } from "styled-components";
import { updateNewsroom, trackTx, TX_TYPE } from "../actionCreators";
import { CivilContext, CivilContextValue } from "../CivilContext";
import { StateWithNewsroom } from "../reducers";
import { TransactionButtonInner } from "../TransactionButtonInner";
import { AboutSmartContractsButton } from "./AboutSmartContractsButton";
import { FormTitle } from "../styledComponents";
import { MutationFunc } from "react-apollo";

export interface NameAndAddressProps {
  userIsOwner?: boolean;
  newsroomAddress?: EthAddress;
  newsroomDeployTxHash?: TxHash;
  charter: Partial<CharterData>;
  newsroom?: any;
  multisig?: EthAddress;
  saveTx: MutationFunc;
  saveAddress: MutationFunc;
  updateCharter(charter: Partial<CharterData>): void;
}

const STANDIN_IPFS_URL = "ipfs://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const STAND_IN_HASH = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

export interface NameAndAddressState extends TransactionButtonModalFlowState {
  collapsableOpen: boolean;
  contentHash?: string;
  contentURI?: string;
}

const SmallText = styled.div`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 13px;
  line-height: 18px;
  display: flex;
  align-items: center;
  margin: 0;
  width: 280px;
`;

const ToolTipLink = styled.a`
  color: ${colors.basic.WHITE};
`;

const Label: StyledComponentClass<any, "div"> = styled.div`
  font-size: 14px;
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 8px;
  margin-top: 15px;
`;

const Success = styled.div`
  position: absolute;
  left: 25px;
  top: 20px;
`;

const Divider = styled.div`
  margin: 24px 0 32px;
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  width: 100%;
  height: 0;
`;

const Subhead = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 32px;
`;

const StyledInput = styled(TextInput)`
  margin-top: 10px;
  & > input {
    padding: 17px;
    display: inline-block;
    width: 472px;
    font-size: 15px;
    line-height: 24px;
  }
`;

const NameDuringPending = styled.div`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  letter-spacing: 0.15px;
  line-height: 24px;
  margin-bottom: 35px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonText = styled.div`
  line-height: 20px;
  margin-right: 15px;
`;

const AddressSection = styled.div`
  margin-bottom: 34px;
`;

export class CreateNewsroomContractComponent extends React.Component<
  NameAndAddressProps & DispatchProp<any>,
  NameAndAddressState
> {
  constructor(props: NameAndAddressProps & DispatchProp<any>) {
    super(props);
    this.state = {
      modalOpen: false,
      collapsableOpen: true,
      isPreTransactionModalOpen: false,
    };
  }

  public onChange(name: string, value: string | void): void {
    this.props.updateCharter({
      ...this.props.charter,
      name: value || undefined,
    });
  }

  public progressModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    const message = this.props.newsroomAddress
      ? "Your name change is processing"
      : "Your newsroom smart contract is processing";
    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>
          You have confirmed the transaction in MetaMask{!this.props.newsroomAddress &&
            ", and now computers around the world are learning about your newsroom contract"}.
        </p>
        <p>
          Note: this could take a while depending on Ethereum network traffic. You can close this window while the
          transaction is processing.<br />
        </p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ modalOpen: false })}>
          OK
        </Button>
      </Modal>
    );
  }

  public renderCheckMark(): JSX.Element | null {
    if (!this.props.newsroomAddress) {
      return null;
    }
    return (
      <Success>
        <GreenCheckMark />
      </Success>
    );
  }

  public renderPreMetamaskCreateModal(): JSX.Element | null {
    if (!this.state.isPreTransactionModalOpen) {
      return null;
    }
    const message = this.props.newsroomAddress
      ? "Open MetaMask to confirm your name change"
      : "Open MetaMask to confirm and create a newsroom smart contract";
    return (
      <MetaMaskModal
        waiting={false}
        cancelTransaction={() => this.cancelTransaction()}
        startTransaction={() => this.startTransaction()}
      >
        <ModalHeading>{message}</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderMetaMaskRejectionModal(): JSX.Element | null {
    if (!this.state.metaMaskRejectionModal) {
      return null;
    }
    const message = this.props.newsroomAddress
      ? "Your name change did not complete"
      : "Your newsroom smart contract creation did not complete";

    const denialMessage = this.props.newsroomAddress
      ? "To change your newsroom's name, you need to confirm the transaction in your MetaMask wallet."
      : "To create your newsroom smart contract, you need to confirm the transaction in your MetaMask wallet. You will not be able to proceed without creating a newsroom smart contract.";

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

  public renderAwaitingTransactionModal(): JSX.Element | null {
    if (!this.state.isWaitingTransactionModalOpen) {
      return null;
    }
    return (
      <MetaMaskModal
        waiting={true}
        cancelTransaction={() => this.cancelTransaction()}
        startTransaction={() => this.startTransaction()}
      >
        <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderNoContract(): JSX.Element {
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <>
            <FormTitle>Let’s get your Newsroom Smart Contract started</FormTitle>
            <Subhead>Enter or confirm your newsroom name to create your Newsroom Smart Contract.</Subhead>
            <StyledInput
              label="Newsroom Name"
              placeholder="Enter your newsroom's name"
              name="NameInput"
              value={this.props.charter.name || ""}
              onChange={(name, val) => this.onChange(name, val)}
            />
            <SmallText>
              Estimated Cost{" "}
              <QuestionToolTip
                explainerText={
                  <>
                    Current Prices based on{" "}
                    <ToolTipLink href="https://ethgasstation.info/" target="_blank">
                      {"https://ethgasstation.info/"}
                    </ToolTipLink>
                  </>
                }
              />
            </SmallText>
            <GasEstimate
              civil={value.civil!}
              estimateFunctions={[
                value.civil!.estimateNewsroomDeployTrusted.bind(
                  value.civil,
                  this.props.charter.name || "",
                  STANDIN_IPFS_URL,
                  STAND_IN_HASH,
                ),
              ]}
            />
            <TransactionButtonNoModal transactions={this.getTransactions(value.civil!)} Button={TransactionButtonInner}>
              Create Newsroom Smart Contract
            </TransactionButtonNoModal>
            <SmallText>This will open your wallet asking to process your transaction.</SmallText>
          </>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderContract(): JSX.Element {
    return (
      <>
        <FormTitle>Newsroom Smart Contract created!</FormTitle>
        <Subhead>You'll be able to view these details on your Registry Profile page.</Subhead>
        <Label>Newsroom Name</Label>
        <NameDuringPending>{this.props.charter.name}</NameDuringPending>
        <AddressSection>
          <Label>Newsroom Contract Address</Label>
          <AddressWithCopyButton address={this.props.newsroomAddress || ""} />
          <StepDescription>
            Your newsroom contract address is like the byline of your newsroom on the Ethereum blockchain.<strong>
              {" "}
              CVL or ETH cannot be sent to this contract address. If funds are sent to this address, you will lose your
              cryptocurrency and the Civil Media Company can not help you to retrieve it.
            </strong>
          </StepDescription>
        </AddressSection>
        <AddressSection>
          <Label>Newsroom Public Wallet Address</Label>
          <AddressWithCopyButton address={this.props.multisig || ""} />
          <StepDescription>
            The public wallet address is a multisignature address used to manage permissions for your Newsroom Smart
            Contract. It is also a place where you can store your newsrooms funds.{" "}
            <strong>CVL and ETH can be sent to this wallet address.</strong>
          </StepDescription>
        </AddressSection>
      </>
    );
  }

  public renderOnlyTxHash(): JSX.Element {
    return (
      <>
        <FormTitle>Let’s get your Newsroom Smart Contract started</FormTitle>
        <Subhead>Enter or confirm your newsroom name to create your Newsroom Smart Contract.</Subhead>
        <Label>Newsroom Name</Label>
        <NameDuringPending>{this.props.charter.name}</NameDuringPending>
        <StyledButton disabled={true} size={buttonSizes.MEDIUM_WIDE}>
          <ButtonText>Creating smart contract...</ButtonText> <ClipLoader size={20} />
        </StyledButton>
      </>
    );
  }

  public render(): JSX.Element {
    let body;
    if (this.props.newsroomAddress) {
      body = this.renderContract();
    } else if (this.props.newsroomDeployTxHash) {
      body = this.renderOnlyTxHash();
    } else {
      body = this.renderNoContract();
    }
    return (
      <>
        <OBSectionHeader>Create your Newsroom Smart Contract</OBSectionHeader>
        <OBSectionDescription>
          Your Newsroom Smart Contract effectively acts as your newsroom's byline on the Ethereum blockchain, and it
          binds your newsroom’s identity to the content you create.
        </OBSectionDescription>
        <AboutSmartContractsButton />
        <Divider />
        {body}
        {this.renderPreMetamaskCreateModal()}
        {this.renderAwaitingTransactionModal()}
        {this.renderMetaMaskRejectionModal()}
        {this.progressModal()}
      </>
    );
  }

  private getTransactions = (civil: Civil, noPreModal?: boolean): Transaction[] => {
    if (!this.props.newsroomAddress) {
      let requireBeforeTransaction;
      if (this.state.contentHash && this.state.contentURI) {
        requireBeforeTransaction = noPreModal ? undefined : this.requireBeforeTransaction;
      } else {
        requireBeforeTransaction = this.beforeCreateNewsroom.bind(this, noPreModal);
      }
      return [
        {
          requireBeforeTransaction,
          transaction: async () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.createNewsroom(civil);
          },
          postTransaction: this.postTransaction,
          handleTransactionHash: async (txHash: TxHash) => {
            this.props.dispatch!(trackTx(TX_TYPE.CREATE_NEWSROOM, "start", txHash));
            await this.props.saveTx({ variables: { input: txHash } });
            this.setState({
              modalOpen: true,
              isWaitingTransactionModalOpen: false,
            });
          },
          handleTransactionError: this.handleTransactionError,
        },
      ];
    } else {
      return [
        {
          requireBeforeTransaction: noPreModal ? undefined : this.requireBeforeTransaction,
          transaction: async () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.changeName();
          },
          postTransaction: this.onNameChange,
          handleTransactionHash: txHash => {
            this.props.dispatch!(trackTx(TX_TYPE.CHANGE_NAME, "start", txHash));
            this.setState({
              modalOpen: true,
              isWaitingTransactionModalOpen: false,
            });
          },
          handleTransactionError: this.handleTransactionError,
        },
      ];
    }
  };

  private postTransaction = async (result: any, txHash?: TxHash): Promise<void> => {
    await this.props.saveAddress({ variables: { input: result.address } });
    this.props.dispatch!(updateNewsroom(result, { charter: this.props.charter }));
    this.props.dispatch!(trackTx(TX_TYPE.CREATE_NEWSROOM, "complete", txHash));
    this.setState({ modalOpen: false, collapsableOpen: false });
  };

  private changeName = async (): Promise<TwoStepEthTransaction<any>> => {
    return this.props.newsroom!.setName(this.props.charter.name!);
  };

  private onNameChange = (result: any, txHash?: TxHash): void => {
    this.props.dispatch!(trackTx(TX_TYPE.CHANGE_NAME, "complete", txHash));
    this.setState({ modalOpen: false });
  };

  private createNewsroom = async (civil: Civil): Promise<TwoStepEthTransaction<any>> => {
    return civil.newsroomDeployTrusted(this.props.charter.name!, this.state.contentURI, this.state.contentHash);
  };

  private handleTransactionError = (err: Error, txHash?: TxHash) => {
    this.props.dispatch!(
      trackTx(this.props.newsroomAddress ? TX_TYPE.CREATE_NEWSROOM : TX_TYPE.CHANGE_NAME, "error", txHash),
    );
    this.setState({ isWaitingTransactionModalOpen: false });
    if (err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
      this.setState({ metaMaskRejectionModal: true });
    }
  };

  private requireBeforeTransaction = async () => {
    return new Promise((res, rej) => {
      this.setState({
        startTransaction: res,
        cancelTransaction: rej,
        isPreTransactionModalOpen: true,
      });
    });
  };

  private beforeCreateNewsroom = async (noPreModal?: boolean): Promise<any> => {
    const ipfsProvider = new IPFSProvider();
    const ipfsObject = await ipfsProvider.put(JSON.stringify(this.props.charter));
    this.setState({
      contentHash: ipfsObject.contentHash,
      contentURI: ipfsObject.uri,
    });
    return noPreModal ? undefined : this.requireBeforeTransaction();
  };

  private cancelTransaction = () => {
    if (this.state.cancelTransaction) {
      this.state.cancelTransaction();
    }
    this.setState({
      cancelTransaction: undefined,
      startTransaction: undefined,
      isPreTransactionModalOpen: false,
      metaMaskRejectionModal: false,
    });
  };

  private startTransaction = () => {
    if (this.state.startTransaction) {
      this.state.startTransaction();
    }
    this.setState({
      cancelTransaction: undefined,
      startTransaction: undefined,
      isPreTransactionModalOpen: false,
      isWaitingTransactionModalOpen: true,
    });
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: NameAndAddressProps): NameAndAddressProps => {
  const { newsroomAddress } = ownProps;
  const newsroom = state.newsrooms.get(newsroomAddress || "") || { wrapper: { data: {} } };
  const multisig = newsroom.multisigAddress;

  return {
    ...ownProps,
    multisig,
  };
};

export const CreateNewsroomContract = connect(mapStateToProps)(CreateNewsroomContractComponent);
