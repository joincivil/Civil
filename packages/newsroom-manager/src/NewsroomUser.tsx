import * as React from "react";
import {
  colors,
  Modal,
  Button,
  TransactionButtonNoModal,
  TransactionButtonModalFlowState,
  Transaction,
  buttonSizes,
  MetaMaskModal,
  ModalHeading,
  TransactionButtonInnerProps,
  ClipLoader,
} from "@joincivil/components";
import { EthAddress, NewsroomRoles, TxHash } from "@joincivil/core";
import styled, { StyledComponentClass } from "styled-components";
import { TertiaryButton as _TertiaryButton, FormSubhead } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { connect, DispatchProp } from "react-redux";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { removeEditor, fetchNewsroom } from "./actionCreators";

export enum UserTypes {
  EDITOR = "EDITOR",
  OWNER = "OWNER",
}

const TertiaryButton = styled(_TertiaryButton)`
  margin: 1em 0;
`;

const Wrapper: StyledComponentClass<{}, "div"> = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

const NameSection = styled.div`
  margin-right: 80px;
  width: 120px;
`;

const ButtonWrapper = styled.div`
  width: 72px;
  margin-left: 15px;
`;

export interface AddressComponentProps {
  name?: string;
}

export interface NewsroomUserProps {
  newsroomAddress: EthAddress;
  address: EthAddress;
  profileWalletAddress?: EthAddress;
  name?: string;
  newsroom: any;
  type: UserTypes;
}

export const DisabledTransactionProcessingButton: StyledComponentClass<any, "button"> = styled.button`
  padding: 8px;
  background: transparent;
  border-radius: 3px;
  border: solid 1px #dddddd;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 1em 0;
`;

const TransactionButtonInner = (props: TransactionButtonInnerProps): JSX.Element => {
  let buttonComponent = (
    <TertiaryButton disabled={props.disabled} onClick={props.onClick} size={buttonSizes.SMALL} fullWidth>
      Remove
    </TertiaryButton>
  );
  switch (props.step) {
    case 1:
      buttonComponent = (
        <TertiaryButton disabled={true} size={buttonSizes.SMALL} fullWidth>
          Confirm
        </TertiaryButton>
      );
      break;
    case 2:
      buttonComponent = (
        <DisabledTransactionProcessingButton>
          <ClipLoader size={10} />
        </DisabledTransactionProcessingButton>
      );
      break;
  }
  return buttonComponent;
};

export class NewsroomUserComponent extends React.Component<
  NewsroomUserProps & DispatchProp<any>,
  TransactionButtonModalFlowState
> {
  constructor(props: NewsroomUserProps & DispatchProp<any>) {
    super(props);
    this.state = {};
  }
  public renderPreMetamMask(): JSX.Element | null {
    if (!this.state.isPreTransactionModalOpen) {
      return null;
    }
    const message =
      this.props.type === UserTypes.EDITOR
        ? "Open MetaMask to remove a Civil Member"
        : "Open MetaMask to remove a Civil Admin";
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
    const message =
      this.props.type === UserTypes.EDITOR ? "Civil Member was not removed" : "Civil Admin was not removed";

    const denailMessage =
      this.props.type === UserTypes.EDITOR
        ? "To remove a Civil Member, you need to confirm the transaction in your MetaMask wallet."
        : "To remove a Civil Admin, you need to confirm the transaction in your MetaMask wallet.";

    return (
      <CivilContext.Consumer>
        {(value: CivilContextValue) => (
          <MetaMaskModal
            waiting={false}
            denied={true}
            denialText={denailMessage}
            cancelTransaction={() => this.cancelTransaction()}
            denialRestartTransactions={this.getTransaction(true)}
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
        <ModalHeading>Waiting to Confirm in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderProgressModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }
    const message =
      this.props.type === UserTypes.EDITOR
        ? "A Civil Member is being removed from the newsroom smart contract!"
        : "A Civil Admin is being removed from the newsroom smart contract!";

    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>You have confirmed the transaction in your MetaMask wallet and it is currently processing</p>
        <p>
          Note: this could take a while depending on traffic on the Ethereum network. You can close this while the
          transaction is processing.
        </p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ modalOpen: false })}>
          OK
        </Button>
      </Modal>
    );
  }

  public renderCompleteModal(): JSX.Element | null {
    if (!this.state.completeModalOpen) {
      return null;
    }

    const message =
      this.props.type === UserTypes.EDITOR
        ? "A Civil Member has been removed from the newsroom smart contract!"
        : "A Civil Admin has been removed from the newsroom smart contract!";
    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>
          The transaction has completed and the{" "}
          {this.props.type === UserTypes.EDITOR ? "Civil Member" : "Civil Officer"} was removed.
        </p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ completeModalOpen: false })}>
          OK
        </Button>
      </Modal>
    );
  }

  public render(): JSX.Element {
    return (
      <>
        <Wrapper>
          <NameSection>
            <FormSubhead>Name</FormSubhead>
            <p>{this.props.name || "Could not find a user with that address"}</p>
          </NameSection>
          <div>
            <FormSubhead>Wallet Address</FormSubhead>
            <p>{this.props.address}</p>
          </div>
          <ButtonWrapper>
            {this.props.address !== this.props.profileWalletAddress && (
              <TransactionButtonNoModal transactions={this.getTransaction()} Button={TransactionButtonInner} />
            )}
          </ButtonWrapper>
        </Wrapper>
        {this.renderProgressModal()}
        {this.renderPreMetamMask()}
        {this.renderMetaMaskRejectionModal()}
        {this.renderCompleteModal()}
        {this.renderAwaitingTransactionModal()}
      </>
    );
  }

  private getTransaction = (noPreModal?: boolean): Transaction[] => {
    return [
      {
        requireBeforeTransaction: noPreModal ? undefined : this.requireBeforeTransaction,
        transaction: async () => {
          this.setState({
            metaMaskRejectionModal: false,
            isWaitingTransactionModalOpen: true,
            isPreTransactionModalOpen: false,
          });
          return this.props.type === UserTypes.OWNER
            ? this.removeOwner(this.props.address)
            : this.removeEditor(this.props.address);
        },
        postTransaction: () => {
          if (this.props.type === UserTypes.EDITOR) {
            this.props.dispatch!(removeEditor(this.props.newsroomAddress!, this.props.address!));
          }
          if (this.props.type === UserTypes.OWNER) {
            this.props.dispatch!(fetchNewsroom(this.props.newsroomAddress!));
          }
          this.setState({
            modalOpen: false,
            completeModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
        handleTransactionHash: this.handleTransactionHash,
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

  private handleTransactionHash = (txhash: TxHash): void => {
    this.setState({
      modalOpen: true,
      isWaitingTransactionModalOpen: false,
    });
  };

  private handleTransactionError = (err: Error): void => {
    this.setState({ isWaitingTransactionModalOpen: false });
    if (err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
      this.setState({ metaMaskRejectionModal: true });
    }
  };

  private removeEditor = async (address: EthAddress) => {
    return this.props.newsroom.removeRole(address, NewsroomRoles.Editor);
  };

  private removeOwner = async (address: EthAddress) => {
    return this.props.newsroom.removeOwner(address);
  };
}

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: Partial<NewsroomUserProps>,
): Partial<NewsroomUserProps> => {
  const { newsroomAddress } = ownProps;
  const newsroom = state.newsrooms.get(newsroomAddress || "") || { wrapper: { data: {} } };
  return {
    ...ownProps,
    newsroom: newsroom.newsroom,
  };
};

export const NewsroomUser = connect(mapStateToProps)(NewsroomUserComponent);
