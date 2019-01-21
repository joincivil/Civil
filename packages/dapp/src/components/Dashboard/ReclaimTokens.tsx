import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { Set } from "immutable";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  StyledDashboardActivityDescription,
  TransactionButtonNoModal,
  InputGroup,
  ModalContent,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { getUserChallengesWithRescueTokens } from "../../selectors";
import { withdrawVotingRights } from "../../apis/civilTCR";
import { FormGroup } from "../utility/FormElements";

const StyledContainer = styled.div`
  padding: 0 24px;
`;

enum TransactionTypes {
  WITHDRAW_VOTING_RIGHTS = "WITHDRAW_VOTING_RIGHTS",
}

const transactionLabels = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: "Transfer Voting Tokens to Available Balance",
};

const transactionSuccessContent = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: [
    "You have successfully transfered your voting tokens",
    <ModalContent>
      Tokens in your Available Balance can be used for applying to The Civil Registry or challenging newsrooms
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: [
    "Your tokens were not transfered",
    "To transfer your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.WITHDRAW_VOTING_RIGHTS]: [
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

export interface ReclaimTokenProps {
  onMobileTransactionClick?(): any;
}

export interface ReclaimTokenReduxProps {
  numUserChallengesWithRescueTokens: number;
  votingBalance: BigNumber;
}

interface ReclaimTokensState {
  numTokens?: string;
  isReclaimAmountValid?: boolean;
}

class ReclaimTokensComponent extends React.Component<
  ReclaimTokenProps & ReclaimTokenReduxProps & InjectedTransactionStatusModalProps,
  ReclaimTokensState
> {
  constructor(props: ReclaimTokenReduxProps & InjectedTransactionStatusModalProps) {
    super(props);
    this.state = {
      numTokens: "0",
      isReclaimAmountValid: true,
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element {
    return (
      <>
        <StyledDashboardActivityDescription>
          <p>Transfer your voting tokens to your available balance</p>

          {!!this.props.numUserChallengesWithRescueTokens &&
            "Please rescue tokens from all of your unrevealed votes before transferring"}
        </StyledDashboardActivityDescription>
        <StyledContainer>
          <p>Voting Tokens: {getFormattedTokenBalance(this.props.votingBalance)}</p>
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
              disabled={!!this.props.numUserChallengesWithRescueTokens}
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

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.WITHDRAW_VOTING_RIGHTS,
          });
          return this.withdrawVotingRights();
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

  private withdrawVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return withdrawVotingRights(numTokens);
  };

  private updateViewState = (name: string, value: string): void => {
    this.setState(() => ({ [name]: value }));
  };
}

const mapStateToProps = (state: State): ReclaimTokenReduxProps => {
  const { user } = state.networkDependent;
  const userChallengesWithRescueTokens: Set<string> = getUserChallengesWithRescueTokens(state)!;
  let votingBalance = new BigNumber(0);
  if (user.account && user.account.votingBalance) {
    votingBalance = user.account.votingBalance;
  }

  return {
    numUserChallengesWithRescueTokens: userChallengesWithRescueTokens.count(),
    votingBalance,
  };
};

export default compose(connect(mapStateToProps), hasTransactionStatusModals(transactionStatusModalConfig))(
  ReclaimTokensComponent,
) as React.ComponentClass<ReclaimTokenProps>;
