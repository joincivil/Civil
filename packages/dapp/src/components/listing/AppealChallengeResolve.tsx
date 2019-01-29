import * as React from "react";
import { compose } from "redux";
import { EthAddress, TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  AppealChallengeResolveCard as AppealChallengeResolveCardComponent,
  AppealChallengeResolveCardProps,
  ModalContent,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { updateStatus } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import {
  ChallengeContainerProps,
  connectChallengePhase,
  connectChallengeResults,
} from "../utility/HigherOrderComponents";
import { AppealChallengeDetailProps } from "./AppealChallengeDetail";

enum TransactionTypes {
  RESOLVE_APPEAL_CHALLENGE = "RESOLVE_APPEAL_CHALLENGE",
}

const transactionLabels = {
  [TransactionTypes.RESOLVE_APPEAL_CHALLENGE]: "Resolve Appeal Challenge",
};

const transactionSuccessContent = {
  [TransactionTypes.RESOLVE_APPEAL_CHALLENGE]: [
    "Thanks for resolving this challenge.",
    <ModalContent>
      Voters can now collect rewards from their votes on this challenge, if they are available.
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.RESOLVE_APPEAL_CHALLENGE]: [
    "The challenge was not resolved",
    "To resolve the challenge, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.RESOLVE_APPEAL_CHALLENGE]: [
    "The was an problem with resolving this challenge",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

export interface ChallengeResolveProps extends ChallengeContainerProps {
  listingAddress: EthAddress;
}

// A container for the Challenge Resolve Card component
class AppealChallengeResolve extends React.Component<AppealChallengeDetailProps & InjectedTransactionStatusModalProps> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element | null {
    const appealGranted = this.props.appeal.appealGranted;
    const appealChallengeTotalVotes = this.props.appealChallenge.poll.votesAgainst.add(
      this.props.appealChallenge.poll.votesFor,
    );
    const appealChallengeVotesFor = getFormattedTokenBalance(this.props.appealChallenge.poll.votesFor);
    const appealChallengeVotesAgainst = getFormattedTokenBalance(this.props.appealChallenge.poll.votesAgainst);
    const appealChallengePercentFor = this.props.appealChallenge.poll.votesFor
      .div(appealChallengeTotalVotes)
      .mul(100)
      .toFixed(0);
    const appealChallengePercentAgainst = this.props.appealChallenge.poll.votesAgainst
      .div(appealChallengeTotalVotes)
      .mul(100)
      .toFixed(0);

    const didAppealChallengeSucceed = this.props.appealChallenge.poll.votesAgainst.greaterThan(
      this.props.appealChallenge.poll.votesFor,
    );

    const transactions = this.getTransactions();

    const AppealChallengeResolveCard = compose<
      React.ComponentClass<ChallengeContainerProps & Partial<AppealChallengeResolveCardProps>>
    >(connectChallengePhase, connectChallengeResults)(AppealChallengeResolveCardComponent);

    return (
      <>
        <AppealChallengeResolveCard
          challengeID={this.props.challengeID.toString()}
          appealChallengeID={this.props.appealChallengeID.toString()}
          appealGranted={appealGranted}
          transactions={transactions}
          appealChallengeTotalVotes={getFormattedTokenBalance(appealChallengeTotalVotes)}
          appealChallengeVotesFor={appealChallengeVotesFor}
          appealChallengeVotesAgainst={appealChallengeVotesAgainst}
          appealChallengePercentFor={appealChallengePercentFor.toString()}
          appealChallengePercentAgainst={appealChallengePercentAgainst.toString()}
          didAppealChallengeSucceed={didAppealChallengeSucceed}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
        />
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
            transactionType: TransactionTypes.RESOLVE_APPEAL_CHALLENGE,
          });
          return this.resolve();
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

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default compose<React.ComponentClass<ChallengeResolveProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AppealChallengeResolve);
