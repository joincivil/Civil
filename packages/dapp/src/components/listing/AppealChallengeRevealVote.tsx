import * as React from "react";
import { compose } from "redux";
import BigNumber from "bignumber.js";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  AppealChallengeRevealVoteCard,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  RevealVoteSuccessIcon,
} from "@joincivil/components";
import { getLocalDateTimeStrings, getFormattedTokenBalance, Parameters } from "@joincivil/utils";
import { revealVote } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote } from "../../helpers/vote";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import { AppealChallengeDetailProps, ChallengeVoteState } from "./AppealChallengeDetail";

enum TransactionTypes {
  REVEAL_VOTE = "REVEAL_VOTE",
}

const transactionLabels = {
  [TransactionTypes.REVEAL_VOTE]: "Confirm Vote",
};

const transactionRejectionContent = {
  [TransactionTypes.REVEAL_VOTE]: [
    "Your vote was not confirmed",
    "To confirm your vote, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.REVEAL_VOTE]: [
    "The was an problem with revealing your vote",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>Your vote selection matches the vote you committed</ModalListItem>
        <ModalListItem>Your secret phrase is correct</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionRejectionContent,
  transactionErrorContent,
};

interface AppealRevealCardKeyState {
  key: number;
}

class AppealChallengeRevealVote extends React.Component<
  AppealChallengeDetailProps & InjectedTransactionStatusModalProps,
  ChallengeVoteState & AppealRevealCardKeyState
> {
  constructor(props: AppealChallengeDetailProps & InjectedTransactionStatusModalProps) {
    super(props);
    this.state = {
      isReviewVoteModalOpen: false,
      numTokens: undefined,
      key: new Date().valueOf(),
    };
  }

  public componentWillMount(): void {
    const transactionSuccessContent = this.getTransactionSuccessContent();
    this.props.setTransactions(this.getTransactions());
    this.props.setTransactionStatusModalConfig({
      transactionSuccessContent,
    });
    this.props.setHandleTransactionSuccessButtonClick(this.handleRevealVoteSuccessClose);
  }

  public render(): JSX.Element | null {
    const { challenge, appealChallenge } = this.props;

    const userHasRevealedVote =
      this.props.userAppealChallengeData && !!this.props.userAppealChallengeData.didUserReveal;
    const userHasCommittedVote =
      this.props.userAppealChallengeData && !!this.props.userAppealChallengeData.didUserCommit;

    const endTime = appealChallenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters[Parameters.challengeAppealRevealLen];
    const secondaryPhaseLength = this.props.parameters[Parameters.challengeAppealCommitLen];

    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

    const transactions = [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.REVEAL_VOTE,
          });
          return this.revealVoteOnChallenge();
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
    const didChallengeSucceed = challenge.poll.votesAgainst.greaterThan(challenge.poll.votesFor);

    const voteOption = this.getVoteOption();
    const salt = fetchSalt(this.props.challengeID, this.props.user);

    return (
      <>
        <AppealChallengeRevealVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          secondaryPhaseLength={secondaryPhaseLength}
          challengeID={this.props.challengeID.toString()}
          challenger={challenger}
          isViewingUserChallenger={challenge!.challenger.toString() === this.props.user}
          rewardPool={rewardPool}
          userHasRevealedVote={userHasRevealedVote}
          userHasCommittedVote={userHasCommittedVote}
          stake={stake}
          voteOption={voteOption}
          salt={salt}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          didChallengeSucceed={didChallengeSucceed}
          onInputChange={this.updateCommitVoteState}
          transactions={transactions}
          appealChallengeID={this.props.appealChallengeID.toString()}
          appealGranted={this.props.appeal.appealGranted}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
          key={this.state.key}
        />
      </>
    );
  }

  private getTransactionSuccessContent = (): TransactionStatusModalContentMap => {
    const endTime = getLocalDateTimeStrings(this.props.appealChallenge.poll.revealEndDate.toNumber());
    return {
      [TransactionTypes.REVEAL_VOTE]: [
        <>
          <RevealVoteSuccessIcon />
          <div>Thanks for confirming your vote.</div>
        </>,
        <>
          <ModalContent>
            We are still waiting for all voters to confirm their votes. Please check back after{" "}
            <strong>
              {endTime[0]} {endTime[1]}
            </strong>{" "}
            to see voting results. Thank you for your patience!
          </ModalContent>
        </>,
      ],
    };
  };

  private handleRevealVoteSuccessClose = (): void => {
    this.props.updateTransactionStatusModalsState({ isTransactionSuccessModalOpen: false });
    this.setState({ isReviewVoteModalOpen: false, key: new Date().valueOf() });
  };

  private getTransactions = (): any => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.REVEAL_VOTE,
          });
          return this.revealVoteOnChallenge();
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

  private getVoteOption(): string | undefined {
    const fetchedVote = fetchVote(this.props.challengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    return voteOption;
  }

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.getVoteOption() as string);
    const saltStr = fetchSalt(this.props.challengeID, this.props.user);
    const salt: BigNumber = new BigNumber(saltStr as string);
    return revealVote(this.props.challengeID, voteOption, salt);
  };

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };
}

export default compose<React.ComponentClass<AppealChallengeDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AppealChallengeRevealVote);
