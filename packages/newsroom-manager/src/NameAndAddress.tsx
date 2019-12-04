import {
  AddressWithCopyButton,
  Button,
  buttonSizes,
  DetailTransactionButton,
  fonts,
  GreenCheckMark,
  LoadingIndicator,
  Modal,
  StepDescription,
  StepHeader,
  TextInput,
  ViewTransactionLink,
  MetaMaskModal,
  ModalHeading,
  Transaction,
  TransactionButtonModalFlowState,
  QuestionToolTip,
} from "@joincivil/components";
import { Civil, TwoStepEthTransaction } from "@joincivil/core";
import { EthAddress, TxHash } from "@joincivil/typescript-types";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import { changeName, updateNewsroom } from "./actionCreators";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { StateWithNewsroom } from "./reducers";
import { TransactionButtonInner } from "./TransactionButtonInner";
import { Newsroom } from "@joincivil/core/build/src/contracts/newsroom";

export interface NameAndAddressProps {
  userIsOwner?: boolean;
  address?: EthAddress;
  txHash?: TxHash;
  name?: string;
  newsroom?: Newsroom;
  active?: boolean;
  onNewsroomCreated?(result: any): void;
  onContractDeployStarted?(txHash: TxHash): void;
}

export interface NameAndAddressState extends TransactionButtonModalFlowState {
  name?: string;
  collapsableOpen: boolean;
}

const Label = styled.div`
  font-size: 15px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-bottom: 10px;
`;

const PendingWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Description = styled(StepDescription)`
  font-size: 14px;
`;

const Success = styled.div`
  position: absolute;
  left: 25px;
  top: 20px;
`;

class NameAndAddressComponent extends React.Component<NameAndAddressProps & DispatchProp<any>, NameAndAddressState> {
  constructor(props: NameAndAddressProps & DispatchProp<any>) {
    super(props);
    this.state = {
      name: this.props.name,
      modalOpen: false,
      collapsableOpen: true,
      isPreTransactionModalOpen: false,
    };
  }

  public componentWillReceiveProps(newProps: NameAndAddressProps): void {
    this.setState({ name: newProps.name });
  }

  public onChange(name: string, value: string | void): void {
    this.props.dispatch!(updateNewsroom(this.props.address || "", { wrapper: { data: { name: value || "" } } }));
  }

  public onContractChange(name: string, value: string | void): void {
    this.setState({ name: value || undefined });
  }

  public progressModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    const message = this.props.address
      ? "Your name change is processing"
      : "Your newsroom smart contract is processing";
    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>
          You have confirmed the transaction in MetaMask
          {!this.props.address && ", and now computers around the world are learning about your newsroom contract"}.
        </p>
        <p>
          Note: this could take a while depending on Ethereum network traffic. You can close this window while the
          transaction is processing.
          <br />
        </p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ modalOpen: false })}>
          OK
        </Button>
      </Modal>
    );
  }

  public renderCheckMark(): JSX.Element | null {
    if (!this.props.address) {
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
    const message = this.props.address
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
    const message = this.props.address
      ? "Your name change did not complete"
      : "Your newsroom smart contract did not complete";

    const denialMessage = this.props.address
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
            restartTransactions={this.getTransactions(value.civil!, true)}
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
            <TextInput
              label="Newsroom Name"
              placeholder="Enter your newsroom's name"
              name="NameInput"
              value={this.props.name || ""}
              onChange={(name, val) => this.onChange(name, val)}
            />
            <DetailTransactionButton
              transactions={this.getTransactions(value.civil!)}
              civil={value.civil}
              estimateFunctions={[value.civil!.estimateNewsroomDeployTrusted.bind(value.civil, this.props.name!)]}
              requiredNetwork={value.requiredNetwork}
              Button={TransactionButtonInner}
              noModal={true}
            >
              Create Newsroom
            </DetailTransactionButton>
          </>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderContract(): JSX.Element {
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <>
            <TextInput
              label="Newsroom Name"
              placeholder="Enter your newsroom's name"
              name="NameInput"
              value={this.state.name || ""}
              onChange={(name, val) => this.onContractChange(name, val)}
              disabled={!this.props.userIsOwner}
            />
            {this.props.userIsOwner && (
              <DetailTransactionButton
                transactions={this.getTransactions(value.civil!)}
                civil={value.civil}
                requiredNetwork={value.requiredNetwork}
                Button={TransactionButtonInner}
                noModal={true}
              >
                Change Name
              </DetailTransactionButton>
            )}
            <div>
              <Label>Newsroom Contract Address</Label>
              <AddressWithCopyButton address={this.props.address || ""} />
              <StepDescription>
                This is your newsroom contract address. It will be added to the Civil Registry. You will be able to view
                it on this page, but you can also save it for future use.
              </StepDescription>
            </div>
          </>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderOnlyTxHash(): JSX.Element {
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <PendingWrapper>
            <LoadingIndicator height={100} width={150} />
            <h3>Your newsroom smart contract is processing.</h3>
            <p>
              You have confirmed this transaction in MetaMask, and now computers around the world are learning about
              your newsroom contract.
            </p>
            <p>
              Note: this could take a while depending on Ethereum network traffic. You can close this window while the
              transaction is processing.
              <br />
              <ViewTransactionLink txHash={this.props.txHash!} network={value.requiredNetwork} />
            </p>
          </PendingWrapper>
        )}
      </CivilContext.Consumer>
    );
  }

  public render(): JSX.Element {
    let body;
    if (this.props.address) {
      body = this.renderContract();
    } else if (this.props.txHash) {
      body = this.renderOnlyTxHash();
    } else {
      body = this.renderNoContract();
    }
    return (
      <>
        <StepHeader active={this.props.active}>
          {this.props.address ? "Newsroom successfully created!" : "Create your newsroom"}
        </StepHeader>
        <Description>
          {this.props.address
            ? "Your newsroom smart contract is set up and ready to go. Here are the details."
            : "Enter your newsroom name to create your newsroom smart contract."}
          <QuestionToolTip
            explainerText={
              "This name will be on your newsroom smart contract. It will also be the public name listed on the Civil Registry."
            }
          />
        </Description>
        {body}
        {this.renderPreMetamaskCreateModal()}
        {this.renderAwaitingTransactionModal()}
        {this.renderMetaMaskRejectionModal()}
        {this.progressModal()}
      </>
    );
  }

  private getTransactions = (civil: Civil, noPreModal?: boolean): Transaction[] => {
    if (!this.props.address) {
      return [
        {
          requireBeforeTransaction: noPreModal ? undefined : this.requireBeforeTransaction,
          transaction: async () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.createNewsroom(civil);
          },
          postTransaction: this.postTransaction,
          handleTransactionHash: (txHash: TxHash) => {
            if (this.props.onContractDeployStarted) {
              this.props.onContractDeployStarted(txHash);
            }
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
          handleTransactionHash: txhash => {
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

  private postTransaction = (result: any): void => {
    if (this.props.onNewsroomCreated) {
      this.props.onNewsroomCreated(result);
    }
    this.setState({ modalOpen: false, collapsableOpen: false });
  };

  private changeName = async (): Promise<TwoStepEthTransaction<any>> => {
    return this.props.newsroom!.setName(this.state.name!);
  };

  private onNameChange = (result: any): void => {
    this.props.dispatch!(changeName(this.props.address!, this.state.name!));
    this.setState({ modalOpen: false });
  };

  private createNewsroom = async (civil: Civil): Promise<TwoStepEthTransaction<any>> => {
    return civil.newsroomDeployTrusted(this.props.name!);
  };

  private handleTransactionError = (err: Error) => {
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
  let newsroom;
  if (ownProps.address && state.newsrooms.get(ownProps.address)) {
    newsroom = state.newsrooms.get(ownProps.address).newsroom;
  }
  return {
    newsroom,
    ...ownProps,
  };
};

export const NameAndAddress = connect(mapStateToProps)(NameAndAddressComponent);
