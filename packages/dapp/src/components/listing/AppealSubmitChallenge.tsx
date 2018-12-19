import * as React from "react";
import { compose } from "redux";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  AppealDecisionCard,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  SubmitChallengeSuccessIcon,
} from "@joincivil/components";

import { approveForChallengeGrantedAppeal, challengeGrantedAppeal } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
// import ScrollToTopOnMount from "../utility/ScrollToTop";

import { AppealDetailProps } from "./AppealDetail";

enum TransactionTypes {
  APPROVE_CHALLENGE_APPEAL = "APPROVE_CHALLENGE_APPEAL",
  CHALLENGE_APPEAL = "CHALLENGE_APPEAL",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: "Approve Challenge Appeal",
  [TransactionTypes.CHALLENGE_APPEAL]: "Challenge Appeal",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: "1 of 2",
  [TransactionTypes.CHALLENGE_APPEAL]: "2 of 2",
};

const denialSuffix = ", you need to confirm the transaction in your MetaMask wallet.";

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: [
    "Your appeal challenge was not submitted",
    "Before submitting an appeal challenge, you need to confirm that you approve the appeal fee deposit",
  ],
  [TransactionTypes.CHALLENGE_APPEAL]: [
    "Your appeal challenge was not submitted",
    `To submit an appeal challenge${denialSuffix}`,
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_CHALLENGE_APPEAL]: [
    "There was a problem approving your appeal challenge",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>You have sufficient CVL in your account for the challenge fee</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.CHALLENGE_APPEAL]: [
    "There was a problem submitting your appeal challenge",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionSuccessContent = {
  [TransactionTypes.CHALLENGE_APPEAL]: [
    "",
    <>
      <SubmitChallengeSuccessIcon />
      <div>This granted appeal has now been challenged</div>
    </>,
    <>
      <ModalContent>
        This challenge is now accepting votes. To prevent decision bias, all votes will be hidden using a secret phrase,
        until the end of the voting period.
      </ModalContent>
      <ModalContent>
        You may vote on your own challenge using your CVL voting tokens, which is separate from your challenge deposit.
      </ModalContent>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  multiStepTransactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class AppealSubmitChallenge extends React.Component<AppealDetailProps & InjectedTransactionStatusModalProps> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const appeal = this.props.appeal;
    const appealGranted = appeal.appealGranted;
    const transactions = this.getTransactions();
    const endTime = appeal.appealOpenToChallengeExpiry.toNumber();
    const phaseLength = this.props.parameters.challengeAppealLen;

    return (
      <AppealDecisionCard
        endTime={endTime}
        challengeID={this.props.challengeID.toString()}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        phaseLength={phaseLength}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        appealGranted={appealGranted}
        transactions={transactions}
      />
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
            transactionType: TransactionTypes.APPROVE_CHALLENGE_APPEAL,
          });
          return approveForChallengeGrantedAppeal();
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
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.CHALLENGE_APPEAL,
          });
          return this.challengeGrantedAppeal();
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

  private challengeGrantedAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeGrantedAppeal(this.props.listingAddress);
  };
}

export default compose<React.ComponentClass<AppealDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AppealSubmitChallenge);
