import * as React from "react";
import { Civil, NewsroomInstance } from "@joincivil/core";
import { NewsroomRoles, abbreviateAddress } from "@joincivil/utils";
import {
  colors,
  fonts,
  TransactionButtonNoModal,
  TransactionButtonModalFlowState,
  HollowGreenCheck,
  MetaMaskModal,
  ModalHeading,
  Modal,
  buttonSizes,
  Button,
  TextInput,
  BorderlessButton,
  ToolTip,
  QuestionToolTip,
} from "@joincivil/components";
import { AvatarImg, AvatarWrap, noAvatar, MemberDisplayName } from "../styledComponents";
import styled from "styled-components";
import Select from "react-select";
import { TransactionButtonInner } from "../TransactionButtonInner";
import { connect, DispatchProp } from "react-redux";
import { StateWithNewsroom } from "../reducers";
import { getUserObject } from "../utils";
import { UserData } from "../types";
import { EthAddress, CharterData } from "@joincivil/typescript-types";
import { addAndHydrateEditor, addAndHydrateOwner, fetchNewsroom, removeEditor } from "../actionCreators";

export interface AddMemberProps {
  civil: Civil;
  newsroom: NewsroomInstance;
  name?: string;
  index: number;
  memberAddress?: EthAddress;
  charter: Partial<CharterData>;
  role?: memberTypes;
  hasBothRoles?: boolean;
  avatarUrl?: string;
  isOnContract?: boolean;
  notInCharter?: boolean;
  profileWalletAddress?: EthAddress;
  forceCharterUpdateForMissingAddress?: boolean;
  updateCharter(charter: Partial<CharterData>): void;
}

export interface AddMemberState extends TransactionButtonModalFlowState {
  selectedState: { label: string; value: memberTypes };
  walletAddress: EthAddress;
  removingOwner?: boolean;
  removingEditor?: boolean;
}

export interface ValueOption {
  label: string;
  value: memberTypes;
}

export interface SelectProps {
  isDisabled: boolean;
  value: ValueOption;
  options: ValueOption[];
  onChange(selected: any): void;
}

export enum memberTypes {
  NONE = "NONE",
  CIVIL_MEMBER = "CIVIL_MEMBER",
  CIVIL_OFFICER = "CIVIL_OFFICER",
}

const options = [
  {
    label: "none",
    value: memberTypes.NONE,
  },
  {
    label: "Civil Member",
    value: memberTypes.CIVIL_MEMBER,
  },
  {
    label: "Civil Officer",
    value: memberTypes.CIVIL_OFFICER,
  },
];

const StyledLi = styled.li`
  display: grid;
  grid-template-columns: 28% 15% 27% 30%;
  padding: 15px 0;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

const SectionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const RemoveButtonWrapper = styled.div`
  margin-top: 15px;
`;

const StyledDisplayName = styled(MemberDisplayName)`
  margin-left: 16px;
`;

const StatusText = styled.span`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 32px;
`;

const AddAddressInfoSection = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  margin-top: 25px;
`;

const AddAddressSection = styled.div`
  display: flex;
  grid-column-start: 1;
  grid-column-end: 4;
`;

const ErrorText = styled.h4`
  color: ${colors.accent.CIVIL_RED};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: bold;
  line-height: 21px;
`;

const StyledInput = styled(TextInput)`
  margin-top: 10px;
  width: auto;
  & > input {
    padding: 17px;
    display: inline-block;
    width: 472px;
    font-size: 15px;
    line-height: 24px;
  }
  & > label {
    display: none;
  }
`;

const ExplainerText = styled.p`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 21px;
`;

const StyledSelect = styled(Select)`
  width: 150px;
`;

const StyledCheck = styled(HollowGreenCheck)`
  margin-right: 10px;
`;

export class AddMemberComponent extends React.Component<AddMemberProps & DispatchProp<any>, AddMemberState> {
  constructor(props: AddMemberProps & DispatchProp<any>) {
    super(props);
    const value = options.find(option => {
      return option.value === props.role;
    });
    this.state = {
      selectedState: value!,
      walletAddress: "",
    };
  }

  public componentDidUpdate(prevProps: AddMemberProps): void {
    if (prevProps.role !== this.props.role) {
      const value = options.find(option => {
        return option.value === this.props.role;
      });
      this.setState({
        selectedState: value!,
      });
    }
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

  public renderCompleteModal(): JSX.Element | null {
    if (!this.state.completeModalOpen) {
      return null;
    }
    const removing = this.state.removingEditor || this.state.removingOwner;
    let message = "";
    let role;
    if (this.state.removingEditor) {
      role = memberTypes.CIVIL_MEMBER;
      message = "A Civil Member has been removed from the newsroom smart contract!";
    } else if (this.state.removingOwner) {
      role = memberTypes.CIVIL_OFFICER;
      message = "A Civil Officer has been removed from the newsroom smart contract!";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_MEMBER) {
      role = memberTypes.CIVIL_MEMBER;
      message = "A Civil Member has been added to the newsroom smart contract!";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_OFFICER) {
      role = memberTypes.CIVIL_OFFICER;
      message = "A Civil Officer has been added to the newsroom smart contract!";
    }

    return (
      <Modal textAlign="left">
        <h2>{message}</h2>
        <p>
          The transaction has completed and the {role === memberTypes.CIVIL_MEMBER ? "Civil Member" : "Civil Officer"}{" "}
          was {removing ? "removed" : "added"}. You can keep adding officers and members to your newsroom smart contract
          or continue to the next step to create your Registry profile.
        </p>
        <Button
          size={buttonSizes.MEDIUM_WIDE}
          onClick={() => {
            this.setState({
              completeModalOpen: false,
              removingEditor: false,
              removingOwner: false,
            });
          }}
        >
          OK
        </Button>
      </Modal>
    );
  }

  public renderPreMetamMask(): JSX.Element | null {
    if (!this.state.isPreTransactionModalOpen) {
      return null;
    }

    let message = "";
    if (this.state.removingEditor) {
      message = "Open MetaMask to remove Civil Member";
    } else if (this.state.removingOwner) {
      message = "Open MetaMask to remove Civil Officer";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_MEMBER) {
      message = "Open MetaMask to add Civil Member";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_OFFICER) {
      message = "Open MetaMask to add Civil Officer";
    }

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

  public renderProgressModal(): JSX.Element | null {
    if (!this.state.modalOpen) {
      return null;
    }

    let message = "";
    if (this.state.removingEditor) {
      message = "A Civil Member is being removed from your newsroom smart contract";
    } else if (this.state.removingOwner) {
      message = "A Civil Officer is being removed from your newsroom smart contract";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_MEMBER) {
      message = "A Civil Member is being added to your newsroom smart contract";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_OFFICER) {
      message = "A Civil Officer is being added to your newsroom smart contract";
    }

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

  public renderMetaMaskRejectionModal(): JSX.Element | null {
    if (!this.state.metaMaskRejectionModal) {
      return null;
    }

    let message = "";
    let denialMessage = "";
    if (this.state.removingEditor) {
      denialMessage = "To remove a Civil Member, you need to confirm the transaction in your MetaMask wallet.";
      message = "Your Civil Member was not removed";
    } else if (this.state.removingOwner) {
      denialMessage = "To remove a Civil Officer, you need to confirm the transaction in your MetaMask wallet.";
      message = "Your Civil Officer was not removed";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_MEMBER) {
      denialMessage = "To add a new Civil Member, you need to confirm the transaction in your MetaMask wallet.";
      message = "Your new Civil Member was not added";
    } else if (this.state.selectedState.value === memberTypes.CIVIL_OFFICER) {
      denialMessage = "To add a new Civil Officer, you need to confirm the transaction in your MetaMask wallet.";
      message = "Your new Civil Officer was not added";
    }

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText={denialMessage}
        cancelTransaction={() => this.cancelTransaction()}
        restartTransactions={this.getTransaction(true)}
      >
        <ModalHeading>{message}</ModalHeading>
      </MetaMaskModal>
    );
  }

  public renderAddAddress(): JSX.Element | null {
    if (this.props.memberAddress || this.state.selectedState.value === memberTypes.NONE) {
      return null;
    }

    return (
      <>
        <AddAddressInfoSection>
          <ErrorText>Missing wallet address</ErrorText>
          <ExplainerText>
            To add this person to the Newsroom Smart Contract, please add their wallet address to their roster profile.
          </ExplainerText>
          {this.props.forceCharterUpdateForMissingAddress && (
            <ExplainerText>
              {/* This is a terrible UX hack, but the post-apply smart contract manager isn't wired up to the publish charter flow so we can't just add it on the fly here. */}
              To do this, first select the "Edit Charter" tab above, then edit this user in the "Roster" section to add
              their ethereum wallet address. Once you have saved and published your updated charter, please return here
              to assign this user their role.
            </ExplainerText>
          )}
        </AddAddressInfoSection>
        {!this.props.forceCharterUpdateForMissingAddress && (
          <AddAddressSection>
            <StyledInput
              placeholder="Public Wallet Address"
              name="walletAddress"
              value={this.state.walletAddress}
              onChange={(name: any, val: any) => this.setState({ walletAddress: val })}
            />
            <BorderlessButton onClick={this.addAddress}>Add Wallet Address</BorderlessButton>
          </AddAddressSection>
        )}
      </>
    );
  }

  public renderRemoveButton(): JSX.Element | null {
    const isMe =
      this.props.profileWalletAddress &&
      this.props.profileWalletAddress.toLowerCase() === (this.props.memberAddress || "").toLowerCase();
    if (!this.props.isOnContract || isMe) {
      return null;
    }
    return (
      <RemoveButtonWrapper>
        <TransactionButtonNoModal Button={TransactionButtonInner} transactions={this.getRemoveTransactions(false)}>
          Remove Role
        </TransactionButtonNoModal>
      </RemoveButtonWrapper>
    );
  }

  public render(): JSX.Element {
    let fourthSection = null;
    if (this.props.memberAddress && this.state.selectedState.value !== memberTypes.NONE) {
      fourthSection = this.props.isOnContract ? (
        <>
          <StyledCheck />
          <StatusText>Added to Smart Contract</StatusText>
        </>
      ) : (
        <TransactionButtonNoModal Button={TransactionButtonInner} transactions={this.getTransaction(false)}>
          Add to Smart Contract
        </TransactionButtonNoModal>
      );
    }
    return (
      <>
        <StyledLi>
          <SectionWrapper>
            <AvatarWrap>{this.props.avatarUrl ? <AvatarImg src={this.props.avatarUrl} /> : noAvatar}</AvatarWrap>
            <StyledDisplayName>
              {this.props.name}
              {this.props.notInCharter && (
                <>
                  <i>not in charter</i>
                  <QuestionToolTip
                    explainerText={
                      "This ETH address was found on your newsroom smart contract, but there is no roster member in your charter with that address. If you know who this ETH address belongs to, please update your charter accordingly."
                    }
                  />
                </>
              )}
            </StyledDisplayName>
          </SectionWrapper>
          <SectionWrapper>
            <ToolTip explainerText={<code>{this.props.memberAddress}</code>} width={310}>
              <code>{this.props.memberAddress && abbreviateAddress(this.props.memberAddress)}</code>
            </ToolTip>
          </SectionWrapper>
          <SectionWrapper>
            <StyledSelect
              isDisabled={this.props.isOnContract}
              value={this.state.selectedState}
              onChange={this.onChange}
              options={options}
            />
          </SectionWrapper>
          <SectionWrapper>{fourthSection}</SectionWrapper>
          <SectionWrapper>{this.renderRemoveButton()}</SectionWrapper>
          {this.renderAddAddress()}
        </StyledLi>
        {this.renderPreMetamMask()}
        {this.renderAwaitingTransactionModal()}
        {this.renderMetaMaskRejectionModal()}
        {this.renderCompleteModal()}
        {this.renderProgressModal()}
      </>
    );
  }

  private getRemoveTransactions = (noPremodal: boolean) => {
    if (this.props.role === memberTypes.CIVIL_OFFICER) {
      return [
        {
          requireBeforeTransaction: noPremodal
            ? undefined
            : async () => {
                this.setState({ removingOwner: true });
                return this.requireBeforeTransaction();
              },
          transaction: async () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.props.newsroom.removeOwner(this.props.memberAddress!);
          },
          postTransaction: () => {
            this.setState({
              modalOpen: false,
              completeModalOpen: true,
            });
            this.props.dispatch!(fetchNewsroom(this.props.newsroom.address));
          },
          handleTransactionHash: this.handleTransactionHash,
          handleTransactionError: this.handleTransactionError,
        },
      ];
    } else {
      return [
        {
          requireBeforeTransaction: noPremodal
            ? undefined
            : async () => {
                this.setState({ removingEditor: true });
                return this.requireBeforeTransaction();
              },
          transaction: async () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.props.newsroom.removeRole(this.props.memberAddress!, NewsroomRoles.Editor);
          },
          postTransaction: () => {
            this.setState({
              modalOpen: false,
              completeModalOpen: true,
            });
            this.props.dispatch!(removeEditor(this.props.newsroom.address, this.props.memberAddress!));
          },
          handleTransactionHash: this.handleTransactionHash,
          handleTransactionError: this.handleTransactionError,
        },
      ];
    }
  };

  private getTransaction = (noPreModal: boolean) => {
    if (this.state.selectedState.value === memberTypes.CIVIL_OFFICER) {
      return [
        {
          requireBeforeTransaction: noPreModal ? undefined : this.requireBeforeTransaction,
          transaction: async () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.props.newsroom.addOwner(this.props.memberAddress!);
          },
          postTransaction: () => {
            this.props.dispatch!(addAndHydrateOwner(this.props.newsroom.address, this.props.memberAddress!));
            this.setState({
              modalOpen: false,
              completeModalOpen: true,
            });
          },
          handleTransactionHash: this.handleTransactionHash,
          handleTransactionError: this.handleTransactionError,
        },
      ];
    } else {
      return [
        {
          requireBeforeTransaction: noPreModal ? undefined : this.requireBeforeTransaction,
          transaction: () => {
            this.setState({
              metaMaskRejectionModal: false,
              isWaitingTransactionModalOpen: true,
              isPreTransactionModalOpen: false,
            });
            return this.props.newsroom.addRole(this.props.memberAddress!, NewsroomRoles.Editor);
          },
          postTransaction: () => {
            this.props.dispatch!(addAndHydrateEditor(this.props.newsroom.address, this.props.memberAddress!));
            this.setState({
              modalOpen: false,
              completeModalOpen: true,
            });
          },
          handleTransactionHash: this.handleTransactionHash,
          handleTransactionError: this.handleTransactionError,
        },
      ];
    }
  };

  private handleTransactionHash = () => {
    this.setState({
      modalOpen: true,
      isWaitingTransactionModalOpen: false,
    });
  };

  private handleTransactionError = (err: Error) => {
    this.setState({ isWaitingTransactionModalOpen: false });
    if (err && err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
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

  private onChange = (selected: any) => {
    this.setState({ selectedState: selected });
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

  private addAddress = async () => {
    const member = this.props.charter.roster![this.props.index];
    const roster = [...this.props.charter.roster!];
    roster[this.props.index] = { ...member, ethAddress: this.state.walletAddress };
    return this.props.updateCharter({
      ...this.props.charter,
      roster,
    });
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: AddMemberProps): AddMemberProps => {
  const address = ownProps.newsroom ? ownProps.newsroom.address : "";
  const newsroom = state.newsrooms.get(address);
  const owners: UserData[] = ((newsroom.wrapper && newsroom.wrapper.data && newsroom.wrapper.data.owners) || []).map(
    getUserObject.bind(null, state),
  );
  const editors: UserData[] = ((newsroom.editors && newsroom.editors.toArray()) || []).map(
    getUserObject.bind(null, state),
  );

  let isOnContract = false;
  let owner = false;
  let editor = false;
  let role = memberTypes.NONE;
  if (ownProps.memberAddress) {
    owner =
      owners.findIndex((item: UserData) => {
        return (
          !!item.rosterData.ethAddress &&
          item.rosterData.ethAddress!.toLowerCase() === ownProps.memberAddress!.toLowerCase()
        );
      }) > -1;
    editor =
      editors.findIndex((item: UserData) => {
        return (
          !!item.rosterData.ethAddress &&
          item.rosterData.ethAddress!.toLowerCase() === ownProps.memberAddress!.toLowerCase()
        );
      }) > -1;
    isOnContract = owner || editor;
    if (owner) {
      role = memberTypes.CIVIL_OFFICER;
    } else if (editor) {
      role = memberTypes.CIVIL_MEMBER;
    }
  }

  return {
    ...ownProps,
    isOnContract,
    role,
  };
};

export const AddMember = connect(mapStateToProps)(AddMemberComponent);
