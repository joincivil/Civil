import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  StyledDashboardActivityDescription,
  TransactionButtonNoModal,
  InputGroup,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { approveVotingRights, requestVotingRights } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { FormGroup } from "../utility/FormElements";

const StyledContainer = styled.div`
  padding: 0 24px;
`;

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
    "You have successfully transfered your voting tokens",
    <ModalContent>
      Tokens in your Voting Balance can be used for voting on Challenges on The Civil Registry
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "Your tokens were not transfered",
    "Before transferring tokens, you need to confirm the approval of your voting token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "Your tokens were not transfered",
    "To transfer your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "The was an problem with transferring your tokens",
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
    "The was an problem with transfering your tokens",
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
  votingBalance: BigNumber;
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
        <StyledDashboardActivityDescription>
          <p>Transfer your available balance tokens to your voting balance</p>
        </StyledDashboardActivityDescription>
        <StyledContainer>
          <p>Available Tokens: {getFormattedTokenBalance(this.props.balance)}</p>
          <FormGroup>
            <InputGroup
              name="numTokens"
              prepend="CVL"
              label="Amount of tokens to transfer"
              onChange={this.updateViewState}
            />
          </FormGroup>

          <FormGroup>
            <TransactionButtonNoModal
              transactions={this.getTransactions()}
              disabledOnMobile={true}
              onMobileClick={this.props.onMobileTransactionClick}
            >
              Transfer
            </TransactionButtonNoModal>
          </FormGroup>
        </StyledContainer>
      </>
    );
  }

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return approveVotingRights(numTokens);
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
  let votingBalance = new BigNumber(0);
  if (user.account && user.account.balance) {
    balance = user.account.balance;
  }
  if (user.account && user.account.votingBalance) {
    votingBalance = user.account.votingBalance;
  }

  return {
    balance,
    votingBalance,
  };
};

export default compose(connect(mapStateToProps), hasTransactionStatusModals(transactionStatusModalConfig))(
  DepositTokensComponent,
) as React.ComponentClass<DepositTokensProps>;
