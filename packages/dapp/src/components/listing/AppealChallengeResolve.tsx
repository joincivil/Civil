import * as React from "react";
import { compose } from "redux";
import {
  EthAddress,
  TwoStepEthTransaction,
  TxHash,
  didAppealChallengeSucceed as getDidAppealChallengeSucceed,
} from "@joincivil/core";
import {
  AppealChallengeResolveCard as AppealChallengeResolveCardComponent,
  AppealChallengeResolveCardProps,
  ModalContent,
} from "@joincivil/components";
import { getFormattedTokenBalance, urlConstants as links } from "@joincivil/utils";

import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
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

const AppealChallengeResolveCard = compose<
  React.ComponentClass<ChallengeContainerProps & Partial<AppealChallengeResolveCardProps>>
>(
  connectChallengePhase,
  connectChallengeResults,
)(AppealChallengeResolveCardComponent);

// A container for the Challenge Resolve Card component
class AppealChallengeResolve extends React.Component<AppealChallengeDetailProps & InjectedTransactionStatusModalProps> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

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
      .mul(100)
      .div(appealChallengeTotalVotes)
      .toString();
    const appealChallengePercentAgainst = this.props.appealChallenge.poll.votesAgainst
      .mul(100)
      .div(appealChallengeTotalVotes)
      .toString();

    const didAppealChallengeSucceed = getDidAppealChallengeSucceed(this.props.appealChallenge);

    const transactions = this.getTransactions();

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
          appealGrantedStatementURI={this.props.appeal.appealGrantedStatementURI}
          faqURL={links.FAQ_HOW_TO_UPDATE_NEWSROOM_STATUS}
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
    return this.context.updateStatus(this.props.listingAddress);
  };
}

export default compose<React.ComponentClass<ChallengeResolveProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AppealChallengeResolve);
