import * as React from "react";
import { compose } from "redux";
import BigNumber from "bignumber.js";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";

import {
  RescueTokensDescriptionText,
  ModalContent,
  StyledDashboardActivityDescription,
  TransactionButtonNoModal,
} from "@joincivil/components";

import { rescueTokensInMultiplePolls } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

import ActivityList from "./ActivityList";
import { ChallengesToProcess, StyledBatchButtonContainer, getChallengesToProcess } from "./DashboardActivity";

enum TransactionTypes {
  MULTI_RESCUE_TOKENS = "MULTI_RESCUE_TOKENS",
}

const transactionLabels = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: "Rescue Tokens",
};

const transactionSuccessContent = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: [
    "You have successfully rescued your unrevealed tokens",
    <ModalContent>
      We're sorry you were not able to reveal your vote, and hope that you will continue to participate and help curate
      high-quality, trustworthy journalism
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: [
    "Your tokens were not rescued",
    "To rescue your tokens, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.MULTI_RESCUE_TOKENS]: [
    "The was an problem with rescuing your tokens",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

export interface ChallengesWithTokensToRescueProps {
  challenges: any;
  appealChallenges: any;
  onMobileTransactionClick?(): any;
}

interface ChallengesWithTokensToRescueState {
  challengesToRescue: ChallengesToProcess;
}

class ChallengesWithTokensToRescue extends React.Component<
  ChallengesWithTokensToRescueProps & InjectedTransactionStatusModalProps,
  ChallengesWithTokensToRescueState
> {
  constructor(props: ChallengesWithTokensToRescueProps & InjectedTransactionStatusModalProps) {
    super(props);
    this.state = {
      challengesToRescue: {},
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public componentWillUnmount(): void {
    this.setState(() => ({ challengesToRescue: {} }));
  }

  public render(): JSX.Element {
    const isRescueTokensButtonDisabled = this.isEmpty(this.state.challengesToRescue);
    const transactions = this.getTransactions();

    return (
      <>
        <StyledDashboardActivityDescription>
          <RescueTokensDescriptionText />
        </StyledDashboardActivityDescription>
        <ActivityList
          challenges={this.props.challenges}
          appealChallenges={this.props.appealChallenges}
          resolvedChallenges={true}
          toggleChallengeSelect={this.setChallengesToMultiRescue}
        />
        <StyledBatchButtonContainer>
          <TransactionButtonNoModal
            disabled={isRescueTokensButtonDisabled}
            transactions={transactions}
            disabledOnMobile={true}
            onMobileClick={this.props.onMobileTransactionClick}
          >
            Rescue Tokens
          </TransactionButtonNoModal>
        </StyledBatchButtonContainer>
      </>
    );
  }

  private isEmpty(obj: any): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.MULTI_RESCUE_TOKENS,
          });
          return this.multiRescue();
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

  private setChallengesToMultiRescue = (challengeID: string, isSelected: boolean, salt: BigNumber): void => {
    this.setState(() => ({
      challengesToRescue: { ...this.state.challengesToRescue, [challengeID]: [isSelected, new BigNumber(0)] },
    }));
  };

  private multiRescue = async (): Promise<TwoStepEthTransaction | void> => {
    const challengeIDs = getChallengesToProcess(this.state.challengesToRescue);
    return rescueTokensInMultiplePolls(challengeIDs);
  };
}

export default compose<React.ComponentClass<ChallengesWithTokensToRescueProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengesWithTokensToRescue);
