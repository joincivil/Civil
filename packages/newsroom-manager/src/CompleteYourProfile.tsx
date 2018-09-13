import {
  AddressInput,
  BorderlessButton,
  buttonSizes,
  Collapsable,
  colors,
  DetailTransactionButton,
  fonts,
  QuestionToolTip,
  StepDescription,
  StepHeader,
  StepProps,
  StepStyled,
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
import { fetchNewsroom, uiActions } from "./actionCreators";
import { CivilContext, CivilContextValue } from "./CivilContext";
import { NewsroomUser, UserTypes } from "./NewsroomUser";
import { StateWithNewsroom } from "./reducers";
import { TransactionButtonInner } from "./TransactionButtonInner";

export interface CompleteYourProfileComponentExternalProps extends StepProps {
  address?: EthAddress;
  profileWalletAddress?: EthAddress;
  renderUserSearch?(onSetAddress: any): JSX.Element;
}

export interface CompleteYourProfileComponentProps extends StepProps {
  owners: Array<{ address: EthAddress; name?: string }>;
  editors: Array<{ address: EthAddress; name?: string }>;
  address?: EthAddress;
  newsroom: any;
  active?: boolean;
}

export interface CompleteYourProfileComponentState extends TransactionButtonModalFlowState {
  addOwner: boolean;
  addEditor: boolean;
  newOwner: EthAddress;
  newEditor: EthAddress;
}

const FormSection = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding-top: 10px;
  padding-bottom: 40px;
`;

const FormTitle = styled.h4`
  font-size: 15px;
  color: #000;
  font-family: ${fonts.SANS_SERIF};
  margin-right: 15px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FormTitleSection = Section.extend`
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

const AddButton = BorderlessButton.extend`
  padding-left: 0px;
`;

const CollapsableWrapper = styled.div`
  width: 600px;
`;

const CollapsableInner = styled.div`
  width: 618px;
`;

const Description = StepDescription.extend`
  font-size: 14px;
`;

const QuestionToolTipWrapper = styled.span`
  padding-top: 5px;
`;

const makeUserObject = (state: StateWithNewsroom, item: EthAddress): { address: EthAddress; name?: string } => {
  let name;
  if (state.newsroomUi.get(uiActions.GET_NAME_FOR_ADDRESS)) {
    name = state.newsroomUsers.get(item);
  }
  return {
    address: item,
    name,
  };
};

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
          Note, that this could take a while depending on network traffic. You can close out of this while you wait.
        </p>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={() => this.setState({ modalOpen: false })}>
          Close
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
          The transaction has completed and the {this.state.addEditor ? "member" : "admin"} was added. You can keep
          adding additional members and admins or continue.
        </p>
        <Button
          size={buttonSizes.MEDIUM_WIDE}
          onClick={() => this.setState({ completeModalOpen: false, addEditor: false, addOwner: false })}
        >
          Close
        </Button>
      </Modal>
    );
  }

  public renderEditorInputs(): JSX.Element {
    return this.props.renderUserSearch ? (
      this.props.renderUserSearch((address: string) => this.setState({ newEditor: address }))
    ) : (
      <AddressInput
        address={this.state.newEditor}
        onChange={(name: any, val: any) => this.setState({ newEditor: val })}
      />
    );
  }

  public renderOwnerInputs(): JSX.Element {
    return this.props.renderUserSearch ? (
      this.props.renderUserSearch((address: string) => this.setState({ newOwner: address }))
    ) : (
      <AddressInput address={this.state.newOwner} onChange={(name, val) => this.setState({ newOwner: val })} />
    );
  }

  public renderAddEditorForm(): JSX.Element {
    if (!this.state.addEditor) {
      return (
        <AddButton size={buttonSizes.SMALL} onClick={() => this.setState({ addEditor: true })}>
          + Add Additional Editor
        </AddButton>
      );
    } else {
      return (
        <CivilContext.Consumer>
          {(value: CivilContextValue) => (
            <>
              {this.renderEditorInputs()}
              <DetailTransactionButton
                transactions={this.getTransaction()}
                Button={TransactionButtonInner}
                civil={value.civil}
                requiredNetwork={value.requiredNetwork}
                noModal={true}
              >
                Add Editor
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public renderAddOwnerForm(): JSX.Element {
    if (!this.state.addOwner) {
      return (
        <AddButton size={buttonSizes.SMALL} onClick={() => this.setState({ addOwner: true })}>
          + Add Additional Officer
        </AddButton>
      );
    } else {
      return (
        <CivilContext.Consumer>
          {(value: CivilContextValue) => (
            <>
              {this.renderOwnerInputs()}
              <DetailTransactionButton
                transactions={this.getTransaction()}
                civil={value.civil}
                Button={TransactionButtonInner}
                requiredNetwork={value.requiredNetwork}
                noModal={true}
              >
                Add Officer
              </DetailTransactionButton>
            </>
          )}
        </CivilContext.Consumer>
      );
    }
  }

  public render(): JSX.Element {
    return (
      <StepStyled disabled={this.props.disabled} index={this.props.index || 0}>
        <CollapsableWrapper>
          <Collapsable
            header={
              <>
                <StepHeader active={this.props.active} disabled={this.props.disabled}>
                  Add accounts to your newsroom smart contract
                </StepHeader>
                <Description disabled={this.props.disabled}>
                  Add additional officers and members to your newsroom smart contract. You will need their public wallet
                  addresses. This step is optional, but recommended.
                  <QuestionToolTipWrapper>
                    <QuestionToolTip
                      disabled={this.props.disabled}
                      explainerText={
                        "Think of officers as admins of your newsroom.  You can skip adding an additional officer but if not have one, you will not be able to access you newsroom contract if you lose your private key."
                      }
                    />
                  </QuestionToolTipWrapper>
                </Description>
              </>
            }
            open={!!this.props.address && !this.props.disabled}
            disabled={this.props.disabled}
          >
            <CollapsableInner>
              <FormSection>
                <FormTitleSection>
                  <FormTitle>Civil Officer</FormTitle>
                  <FormDescription>
                    An Officer is an admin role that has all possible capabilities in the newsroom smart contract. They
                    can add additional officers and members and have access to your newsrooms funds and Civil Registry
                    application.
                  </FormDescription>
                </FormTitleSection>
                <Section>
                  {this.props.owners.map(item => {
                    return (
                      <NewsroomUser
                        newsroomAddress={this.props.address}
                        type={UserTypes.OWNER}
                        profileWalletAddress={this.props.profileWalletAddress}
                        key={item.address}
                        address={item.address}
                        name={item.name}
                      />
                    );
                  })}
                </Section>
                {this.renderAddOwnerForm()}
              </FormSection>
              <FormSection>
                <FormTitleSection>
                  <FormTitle>Civil Member</FormTitle>
                  <FormDescription>
                    A Member is the standard role in the newsroom smart contract. They have permission to index and sign
                    posts on the blockchain. They cannot add Civil Officers to a newsroom smart contract.
                  </FormDescription>
                </FormTitleSection>
                <Section>
                  {this.props.editors.map(item => (
                    <NewsroomUser
                      newsroomAddress={this.props.address}
                      type={UserTypes.EDITOR}
                      profileWalletAddress={this.props.profileWalletAddress}
                      key={item.address}
                      address={item.address}
                      name={item.name}
                    />
                  ))}
                </Section>
                {this.renderAddEditorForm()}
              </FormSection>
              {this.renderPreMetamMask()}
              {this.renderAwaitingTransactionModal()}
              {this.renderMetaMaskRejectionModal()}
              {this.renderCompleteModal()}
              {this.renderProgressModal()}
            </CollapsableInner>
          </Collapsable>
        </CollapsableWrapper>
      </StepStyled>
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
  const owners: Array<{ address: EthAddress; name?: string }> = (newsroom.wrapper.data.owners || []).map(
    makeUserObject.bind(null, state),
  );
  const editors: Array<{ address: EthAddress; name?: string }> = (newsroom.editors || []).map(
    makeUserObject.bind(null, state),
  );
  return {
    ...ownProps,
    address,
    owners,
    editors,
    newsroom: newsroom.newsroom,
  };
};

export const CompleteYourProfile = connect(mapStateToProps)(CompleteYourProfileComponent);
