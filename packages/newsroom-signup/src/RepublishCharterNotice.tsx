import * as React from "react";
import styled from "styled-components";
import { CharterData, Civil, IPFSProvider, TxHash, NewsroomInstance } from "@joincivil/core";
import {
  Notice,
  NoticeTypes,
  Transaction,
  TransactionButtonModalFlowState,
  TransactionButtonNoModal,
  TransactionButtonInnerProps,
  MetaMaskModal,
  ModalHeading,
  Modal,
  LoadingIndicator,
  ClipLoader,
  Button,
  buttonSizes,
  MetaMaskSideIcon,
  colors,
} from "@joincivil/components";
import { CivilContext, CivilContextValue } from "./CivilContext";

export interface RepublishCharterNoticeProps {
  civil: Civil;
  charter: Partial<CharterData>;
  newsroom: NewsroomInstance;
  className?: string;
  introCopy?: JSX.Element | string;
  onTxStart?(): void;
  onTxComplete?(): void;
  transactionButtonComponent?(props: TransactionButtonInnerProps): JSX.Element;
}

export interface RepublishCharterNoticeState extends TransactionButtonModalFlowState {
  isIpfsModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  contentHash?: string;
  contentURI?: string;
}

const Wrapper = styled(Notice)`
  font-size: 12px;
  line-height: 18px;
  padding: 15px;
  margin: -24px 0 36px;
`;

const Loader = styled(ClipLoader)`
  margin: 0 0 -2px 4px;
`;
const IconWrap = styled.span`
  position: relative;
  top: 3px;
  padding: 7px 4px 0;
  border-radius: 2px;
  border: solid 1px ${colors.accent.CIVIL_GRAY_4};
`;
const RepublishLink = styled.a`
  cursor: pointer;
  display: inline-block;
`;

export class RepublishCharterNotice extends React.Component<RepublishCharterNoticeProps, RepublishCharterNoticeState> {
  constructor(props: RepublishCharterNoticeProps) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return (
      <Wrapper className={this.props.className} type={NoticeTypes.ALERT}>
        {this.renderIntroCopy()}{" "}
        <CivilContext.Consumer>
          {(value: CivilContextValue) => {
            return (
              <TransactionButtonNoModal
                transactions={this.getTransactions(value.civil!)}
                Button={this.renderTransactionButtonComponent}
              />
            );
          }}
        </CivilContext.Consumer>
        {this.renderIpfsModal()}
        {this.renderPreMetamaskCreateModal()}
        {this.renderAwaitingTransactionModal()}
        {this.renderMetaMaskRejectionModal()}
        {this.renderProgressModal()}
        {this.renderTransactionSuccessModal()}
      </Wrapper>
    );
  }

  public renderIpfsModal(): JSX.Element | null {
    if (!this.state.isIpfsModalOpen) {
      return null;
    }
    return (
      <Modal textAlign="center">
        <LoadingIndicator height={100} width={150} />
        <ModalHeading>Saving charter to IPFS</ModalHeading>
        <p>First we are saving your charter to IPFS. This can take a moment. Please don't close this tab.</p>
      </Modal>
    );
  }

  public renderPreMetamaskCreateModal(): JSX.Element | null {
    if (!this.state.isPreTransactionModalOpen) {
      return null;
    }
    return (
      <MetaMaskModal
        waiting={false}
        cancelTransaction={() => this.cancelTransaction()}
        startTransaction={() => this.startTransaction()}
      >
        <ModalHeading>Open MetaMask to confirm and republish your charter</ModalHeading>
      </MetaMaskModal>
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

  public renderMetaMaskRejectionModal(): JSX.Element | null {
    if (!this.state.metaMaskRejectionModal) {
      return null;
    }
    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <MetaMaskModal
            waiting={false}
            denied={true}
            denialText="To republish your newsroom charter, you need to confirm the transaction in your MetaMask wallet."
            cancelTransaction={() => this.cancelTransaction()}
            denialRestartTransactions={this.getTransactions(value.civil!, true)}
          >
            <ModalHeading>Your charter republish did not complete</ModalHeading>
          </MetaMaskModal>
        )}
      </CivilContext.Consumer>
    );
  }

  public renderProgressModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    return (
      <Modal textAlign="left">
        <ModalHeading>Your charter republish is processing</ModalHeading>
        <p>You have confirmed the transaction in MetaMask.</p>
        <p>
          Note: this could take a while depending on Ethereum network traffic. You can close this window while the
          transaction is processing, but please note that changes won't be reflected until the transaction has
          completed.
        </p>
        <p>If you remain on this page, you will be alerted when the transaction has been completed.</p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ modalOpen: false })}>
          OK
        </Button>
      </Modal>
    );
  }

  public renderTransactionSuccessModal(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    const onClick = () => {
      this.setState({
        isTransactionSuccessModalOpen: false,
      });
      if (this.props.onTxComplete) {
        this.props.onTxComplete();
      }
    };

    return (
      <Modal textAlign="left">
        <ModalHeading>Charter Republished Successfully</ModalHeading>
        <p>Your updated charter has been republished and will be viewable on your newsroom page on the registry.</p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={onClick}>
          OK
        </Button>
      </Modal>
    );
  }

  private renderIntroCopy(): JSX.Element {
    if (this.props.introCopy) {
      return <>{this.props.introCopy}</>;
    }
    return (
      <>
        <strong>Note:</strong> Your charter has already been published alongside your newsroom smart contract. If you
        wish to make any changes, please use the back/next buttons below to navigate between sections. Once you have
        completed any changes, make sure to republish your charter.
      </>
    );
  }
  private renderTransactionButtonComponent = (props: TransactionButtonInnerProps): JSX.Element => {
    if (props.disabled) {
      return <Loader size={12} />;
    }
    if (this.props.transactionButtonComponent) {
      return this.props.transactionButtonComponent(props);
    }
    return (
      <RepublishLink onClick={props.onClick}>
        Republish your charter{" "}
        <IconWrap>
          <MetaMaskSideIcon />
        </IconWrap>
      </RepublishLink>
    );
  };

  private getTransactions = (civil: Civil, noPreModal?: boolean): Transaction[] => {
    return [
      {
        requireBeforeTransaction: this.publishCharterToIpfs.bind(this, noPreModal),
        transaction: async () => {
          this.setState({
            isIpfsModalOpen: false,
            metaMaskRejectionModal: false,
            isWaitingTransactionModalOpen: true,
            isPreTransactionModalOpen: false,
          });
          return this.props.newsroom.updateRevisionURIAndHash(0, this.state.contentURI!, this.state.contentHash!);
        },
        postTransaction: () => {
          this.setState({
            modalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionHash: async (txHash: TxHash) => {
          this.setState({
            modalOpen: true,
            isWaitingTransactionModalOpen: false,
          });
          if (this.props.onTxStart) {
            this.props.onTxStart();
          }
        },
        handleTransactionError: this.handleTransactionError,
      },
    ];
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

  private publishCharterToIpfs = async (noPreModal?: boolean): Promise<any> => {
    this.setState({
      isIpfsModalOpen: true,
    });
    const ipfsProvider = new IPFSProvider();
    const ipfsObject = await ipfsProvider.put(JSON.stringify(this.props.charter));
    this.setState({
      contentHash: ipfsObject.contentHash,
      contentURI: ipfsObject.uri,
      isIpfsModalOpen: false,
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

  private handleTransactionError = (err: Error, txHash?: TxHash) => {
    this.setState({ isWaitingTransactionModalOpen: false });
    if (err && err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
      this.setState({ metaMaskRejectionModal: true });
    }
  };
}
