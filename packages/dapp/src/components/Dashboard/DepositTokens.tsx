import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  TransactionButtonNoModal,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  TransferTokenTipsText,
  StyledTransferTokenFormElement,
  CurrencyInput,
} from "@joincivil/components";
import { State } from "../../redux/reducers";
import { approveVotingRightsForTransfer, requestVotingRights } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { FormGroup } from "../utility/FormElements";

enum TransactionTypes {
  APPROVE_VOTING_RIGHTS = "APPROVE_VOTING_RIGHTS",
  REQUEST_VOTING_RIGHTS = "REQUEST_VOTING_RIGHTS",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "Approve Voting Rights",
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: "Transfer Available Tokens to your Voting Balance",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "1 of 2",
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [undefined, undefined],
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "You have successfully transferred your voting tokens",
    <ModalContent>
      Tokens in your Voting Balance can be used for voting on Challenges on The Civil Registry
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "Your tokens were not transferred",
    "Before transferring tokens, you need to confirm the approval of your voting token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "Your tokens were not transferred",
    "To transfer your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "There was a problem with transferring your tokens",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>
          The number of tokens you are transferring with does not exceed your available balance.
        </ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "There was a problem with transferring your tokens",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

export interface DepositTokensProps {
  onMobileTransactionClick?(): any;
}

export interface DepositTokenReduxProps {
  balance: BigNumber;
}

export interface DepositTokensState {
  numTokens?: string;
}

class DepositTokensComponent extends React.Component<
  DepositTokensProps & DepositTokenReduxProps & InjectedTransactionStatusModalProps,
  DepositTokensState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      numTokens: "0",
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledTransferTokenFormElement>
          <CurrencyInput
            label="Enter amount"
            placeholder="0"
            name="numTokens"
            icon={<>CVL</>}
            onChange={this.updateViewState}
          />
          <TransferTokenTipsText />
        </StyledTransferTokenFormElement>

        <FormGroup>
          <TransactionButtonNoModal
            transactions={this.getTransactions()}
            disabledOnMobile={true}
            onMobileClick={this.props.onMobileTransactionClick}
          >
            Transfer
          </TransactionButtonNoModal>
        </FormGroup>
      </>
    );
  }

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return approveVotingRightsForTransfer(numTokens);
  };

  private depositTokens = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return requestVotingRights(numTokens);
  };

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.APPROVE_VOTING_RIGHTS,
          });
          return this.approveVotingRights();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.REQUEST_VOTING_RIGHTS,
          });
          return this.depositTokens();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private updateViewState = (name: string, value: string): void => {
    this.setState(() => ({ [name]: value }));
  };
}

const mapStateToProps = (state: State): DepositTokenReduxProps => {
  const { user } = state.networkDependent;
  let balance = new BigNumber(0);
  if (user.account && user.account.balance) {
    balance = user.account.balance;
  }

  return {
    balance,
  };
};

export default compose(connect(mapStateToProps), hasTransactionStatusModals(transactionStatusModalConfig))(
  DepositTokensComponent,
) as React.ComponentClass<DepositTokensProps>;
