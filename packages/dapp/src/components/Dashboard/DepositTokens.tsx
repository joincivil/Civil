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
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { requestVotingRights } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { FormGroup } from "../utility/FormElements";

const StyledContainer = styled.div`
  padding: 0 24px;
`;

enum TransactionTypes {
  REQUEST_VOTING_RIGHTS = "REQUEST_VOTING_RIGHTS",
}

const transactionLabels = {
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: "Transfer Available Tokens to your Voting Balance",
};

const transactionSuccessContent = {
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "You have successfully transfered your voting tokens",
    <ModalContent>
      Tokens in your Voting Balance can be used for voting on Challenges on The Civil Registry
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "Your tokens were not transfered",
    "To transfer your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.REQUEST_VOTING_RIGHTS]: [
    "The was an problem with transfering your tokens",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
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
