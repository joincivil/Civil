import {
  AddressInput,
  BorderlessButton,
  buttonSizes,
  colors,
  DetailTransactionButton,
  fonts,
  QuestionToolTip,
  StepDescription,
  StepHeader,
  StepFormSection,
  Transaction,
  TransactionButtonModalFlowState,
  MetaMaskModal,
  ModalHeading,
  Modal,
  Button,
} from "@joincivil/components";
import { EthAddress, NewsroomRoles } from "@joincivil/core";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import { fetchNewsroom } from "./actionCreators";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { NewsroomUser, UserTypes } from "./NewsroomUser";
import { FormTitle } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { getUserObject } from "./utils";
import { UserData } from "./types";
import { TransactionButtonInner } from "./TransactionButtonInner";
import { isValidAddress } from "ethereumjs-util";

export interface CompleteYourProfileComponentExternalProps {
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  address?: EthAddress;
  profileWalletAddress?: EthAddress;
  renderUserSearch?(onSetAddress: any): JSX.Element;
}

export interface CompleteYourProfileComponentProps {
  owners: UserData[];
  editors: UserData[];
  userIsOwner?: boolean;
  userIsEditor?: boolean;
  address?: EthAddress;
  newsroom: any;
  active?: boolean;
}

export interface CompleteYourProfileComponentState extends TransactionButtonModalFlowState {
  addOwner: boolean;
  addEditor: boolean;
  newOwner: EthAddress;
  newEditor: EthAddress;
  disableOwnerAdd: boolean;
  disableEditorAdd: boolean;
}

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FormTitleSection = styled(Section)`
  flex-direction: row;
  justify-content: flex-start;
`;

const FormDescription = styled.p`
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_2};
  font-size: 15px;
  width: 430px;
  margin-left: 50px;
`;

const AddButton = styled(BorderlessButton)`
  padding-left: 0px;
`;

const Description = styled(StepDescription)`
  font-size: 14px;
`;

const QuestionToolTipWrapper = styled.span`
  position: relative;
  top: 3px;
`;

class CompleteYourProfileComponent extends React.Component<
  CompleteYourProfileComponentProps & CompleteYourProfileComponentExternalProps & DispatchProp<any>,
  CompleteYourProfileComponentState
> {
  constructor(props: CompleteYourProfileComponentProps & DispatchProp<any>) {
    super(props);
    this.state = {
      addOwner: false,
      addEditor: false,
      newOwner: "",
      newEditor: "",
      modalOpen: false,
      disableEditorAdd: true,
      disableOwnerAdd: true,
    };
  }

  public renderPreMetamMask(): JSX.Element | null {
    if (!this.state.isPreTransactionModalOpen) {
      return null;
    }
    const message = this.state.addEditor ? "Open MetaMask to add Civil Member" : "Open MetaMask to add Civil Admin";
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
    const message = this.state.addEditor ? "Your new Civil Member was not added" : "Your new Civil Admin was not added";

    const denailMessage = this.state.addEditor
      ? "To add a new Civil Member, you need to confirm the transaction in your MetaMask wallet."
      : "To add a new Civil Admin, you need to confirm the transaction in your MetaMask wallet.";

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
    const message = this.state.addEditor
      ? "A Civil Member is being added to your newsroom smart contract"
      : "A Civil Admin is being added to your newsroom smart contract";
    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>You have confirmed the transaction in your MetaMask wallet and it is currently processing</p>
        <p>
          Note, that this could take a while depending on traffic on the Ethereum network. You can close this while the
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
    const message = this.state.addEditor
      ? "A Civil Member has been added to the newsroom smart contract!"
      : "A Civil Admin has been added to the newsroom smart contract!";
    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>
          The transaction has completed and the {this.state.addEditor ? "Civil Member" : "Civil Officer"} was added. You
          can keep adding officers and members to your newsroom smart contract or continue to the next step to create
          your Registry profile.
        </p>
        <Button
          size={buttonSizes.MEDIUM_WIDE}
          onClick={() => this.setState({ completeModalOpen: false, addEditor: false, addOwner: false })}
        >
          OK
        </Button>
      </Modal>
    );
  }

  public renderEditorInputs(): JSX.Element {
    return this.props.renderUserSearch ? (
      this.props.renderUserSearch((address: string) => {
        const valid = isValidAddress(address);
        this.setState({ newEditor: address, disableEditorAdd: !valid });
      })
    ) : (
      <AddressInput
        address={this.state.newEditor}
        onChange={(name: any, val: any) => this.setState({ newEditor: val })}
      />
    );
  }

  public renderOwnerInputs(): JSX.Element {
    return this.props.renderUserSearch ? (
      this.props.renderUserSearch((address: string) => {
        const valid = isValidAddress(address);
        this.setState({ newOwner: address, disableOwnerAdd: !valid });
      })
    ) : (
      <AddressInput address={this.state.newOwner} onChange={(name, val) => this.setState({ newOwner: val })} />
    );
  }

  public renderAddEditorForm(): JSX.Element {
    if (!this.state.addEditor) {
      return (
        <AddButton size={buttonSizes.SMALL} onClick={() => this.setState({ addEditor: true })}>
          + Add Civil Member
        </AddButton>
      );
    } else {
      return (
        <CivilContext.Consumer>
          {(value: CivilContextValue) => (
            <>
              {this.renderEditorInputs()}
              <DetailTransactionButton
                disabled={this.state.disableEditorAdd}
                transactions={this.getTransaction()}
                Button={TransactionButtonInner}
                civil={value.civil}
                requiredNetwork={value.requiredNetwork}
                noModal={true}
              >
                Add Civil Member
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public renderAddOwnerForm(): JSX.Element {
    if (this.props.userIsEditor && !this.props.userIsOwner) {
      return (
        <p style={{ color: colors.accent.CIVIL_GRAY_2 }}>
          You are on the contract as a Member, not an Officer, so you cannot add additional Officers. You may add and
          remove Civil Members below.
        </p>
      );
    } else if (!this.state.addOwner) {
      return (
        <AddButton size={buttonSizes.SMALL} onClick={() => this.setState({ addOwner: true })}>
          + Add Civil Officer
        </AddButton>
      );
    } else {
      return (
        <CivilContext.Consumer>
          {(value: CivilContextValue) => (
            <>
              {this.renderOwnerInputs()}
              <DetailTransactionButton
                disabled={this.state.disableOwnerAdd}
                transactions={this.getTransaction()}
                civil={value.civil}
                Button={TransactionButtonInner}
                requiredNetwork={value.requiredNetwork}
                noModal={true}
              >
                Add Civil Officer
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public render(): JSX.Element {
    return (
      <>
        <StepHeader>Add accounts to your newsroom smart contract</StepHeader>
        <Description>
          Add additional officers and members to your newsroom smart contract. You will need their public wallet
          addresses. This step is optional, but recommended.
          <QuestionToolTipWrapper>
            <QuestionToolTip
              explainerText={
                "If you lose access to your wallet, only a Civil Officer can add you back to the smart contract with a new address. You can always add Officers and Members later."
              }
            />
          </QuestionToolTipWrapper>
        </Description>
        <StepFormSection>
          <FormTitleSection>
            <FormTitle>Civil Officer</FormTitle>
            <FormDescription>
              An Officer is an admin role that has all possible capabilities in the newsroom smart contract. They can
              add additional officers and members and have access to your newsroom's funds and Civil Registry
              application.
              <QuestionToolTip
                explainerText={
                  "You can skip adding an additional Officer but if you do not have one, you will not be able to access your newsroom contract if you lose access to your wallet."
                }
              />
            </FormDescription>
          </FormTitleSection>
          <Section>
            {this.props.owners.map(item => {
              return (
                <NewsroomUser
                  newsroomAddress={this.props.address}
                  type={UserTypes.OWNER}
                  profileWalletAddress={this.props.profileWalletAddress}
                  key={item.rosterData.ethAddress}
                  address={item.rosterData.ethAddress}
                  name={item.rosterData.name}
                  readOnly={!this.props.userIsOwner}
                />
              );
            })}
          </Section>
          {this.renderAddOwnerForm()}
        </StepFormSection>
        <StepFormSection>
          <FormTitleSection>
            <FormTitle>Civil Member</FormTitle>
            <FormDescription>
              A Member is the standard role in the newsroom smart contract. They have permission to sign, index and
              archive posts on the blockchain. They cannot add Civil Officers to you newsroom smart contract or access
              your newsroom's funds.
              <QuestionToolTip
                explainerText={
                  "If you lose your public wallet address, a Civil Member does not have the option to add additional officers to the contract."
                }
              />
            </FormDescription>
          </FormTitleSection>
          <Section>
            {this.props.editors.map(item => (
              <NewsroomUser
                newsroomAddress={this.props.address}
                type={UserTypes.EDITOR}
                profileWalletAddress={this.props.profileWalletAddress}
                key={item.rosterData.ethAddress}
                address={item.rosterData.ethAddress}
                name={item.rosterData.name}
              />
            ))}
          </Section>
          {this.renderAddEditorForm()}
        </StepFormSection>
        {this.renderPreMetamMask()}
        {this.renderAwaitingTransactionModal()}
        {this.renderMetaMaskRejectionModal()}
        {this.renderCompleteModal()}
        {this.renderProgressModal()}
      </>
    );
  }

  private getTransaction = (noPreModal?: boolean): Transaction[] => {
    return [
      {
        requireBeforeTransaction: noPreModal ? undefined : this.requireBeforeTransaction,
        transaction: async (): Promise<void> => {
          this.setState({
            metaMaskRejectionModal: false,
            isWaitingTransactionModalOpen: true,
            isPreTransactionModalOpen: false,
          });
          return this.state.addEditor ? this.addEditor() : this.addOwner();
        },
        postTransaction: result => {
          this.props.dispatch!(fetchNewsroom(this.props.address!));
          this.setState({
            modalOpen: false,
            completeModalOpen: true,
            newOwner: "",
            newEditor: "",
          });
        },
        handleTransactionHash: txhash => {
          this.setState({
            modalOpen: true,
            isWaitingTransactionModalOpen: false,
          });
        },
        handleTransactionError: (err: Error) => {
          this.setState({ isWaitingTransactionModalOpen: false });
          if (err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
            this.setState({ metaMaskRejectionModal: true });
          }
        },
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

  private addOwner = async (): Promise<void> => {
    return this.props.newsroom.addOwner(this.state.newOwner);
  };

  private addEditor = async (): Promise<void> => {
    return this.props.newsroom.addRole(this.state.newEditor, NewsroomRoles.Editor);
  };
}

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: CompleteYourProfileComponentExternalProps,
): CompleteYourProfileComponentProps & CompleteYourProfileComponentExternalProps => {
  const { address } = ownProps;
  const newsroom = state.newsrooms.get(address || "") || { wrapper: { data: {} } };
  const owners: UserData[] = (newsroom.wrapper.data.owners || []).map(getUserObject.bind(null, state));
  const editors: UserData[] = (newsroom.editors || []).map(getUserObject.bind(null, state));
  return {
    ...ownProps,
    address,
    owners,
    editors,
    newsroom: newsroom.newsroom,
  };
};

export const CompleteYourProfile = connect(mapStateToProps)(CompleteYourProfileComponent);
