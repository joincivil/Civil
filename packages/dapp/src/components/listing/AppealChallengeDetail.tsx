import * as React from "react";
import {
  isAppealChallengeInCommitStage,
  isAppealChallengeInRevealStage,
  AppealData,
  AppealChallengeData,
  ChallengeData,
  EthAddress,
  NewsroomWrapper,
  TwoStepEthTransaction,
  TxHash,
  UserChallengeData,
} from "@joincivil/core";
import BigNumber from "bignumber.js";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  Button,
  buttonSizes,
  AppealChallengeCommitVoteCard,
  AppealChallengeRevealVoteCard,
  AppealChallengeResolveCard,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ProgressModalContentInProgress,
  ReviewVote,
  ReviewVoteProps,
} from "@joincivil/components";
import { commitVote, approveVotingRights, revealVote, updateStatus } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote, saveVote } from "../../helpers/vote";

enum AppealChallengeDetailTransactionTypes {
  APPROVE_VOTING_RIGHTS,
  COMMIT_VOTE,
  REVEAL_VOTE,
  RESOLVE,
}

const AppealChallengeDetailTransactionLabels = {
  [AppealChallengeDetailTransactionTypes.APPROVE_VOTING_RIGHTS]: "Grant Appeal",
  [AppealChallengeDetailTransactionTypes.COMMIT_VOTE]: "Confirm Appeal",
  [AppealChallengeDetailTransactionTypes.REVEAL_VOTE]: "Resolve Appeal",
  [AppealChallengeDetailTransactionTypes.RESOLVE]: "Challenge Appeal",
};

const MultiStepTransactionLabels = {
  [AppealChallengeDetailTransactionTypes.APPROVE_VOTING_RIGHTS]: "1 of 2",
  [AppealChallengeDetailTransactionTypes.COMMIT_VOTE]: "2 of 2",
};

const denialSuffix = ", you need to confirm the transaction in your MetaMask wallet.";

const AppealChallengeDetailTransactionRejectionLabels = {
  [AppealChallengeDetailTransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "Your vote was not commited",
    "Before submitting an appeal challenge, you need to confirm that you approve the appeal fee deposit",
  ],
  [AppealChallengeDetailTransactionTypes.COMMIT_VOTE]: [
    "Your vote was not committed",
    `To commit your vote${denialSuffix}`,
  ],
  [AppealChallengeDetailTransactionTypes.REVEAL_VOTE]: [
    "Your vote was not revealed",
    `To reveal your vote${denialSuffix}`,
  ],
  [AppealChallengeDetailTransactionTypes.RESOLVE]: [
    "The appeal challenge was not resolved",
    `To resolve the appeal challenge${denialSuffix}`,
  ],
};

const AppealChallengeDetailTransactionSuccessLabels = {
  [AppealChallengeDetailTransactionTypes.COMMIT_VOTE]: [
    "Your vote was committed",
    <ModalContent>
      Please keep your secret phrase safe. You will need it to confirm your vote. Votes can not be counted and rewards
      can not be claimed unless you confirm them.
    </ModalContent>,
  ],
  [AppealChallengeDetailTransactionTypes.REVEAL_VOTE]: [
    "Your vote was confirmed",
    <ModalContent>
      We are still waiting for all voters to confirm their votes. Please check back after later see voting results.
      Thank you for your patience!
    </ModalContent>,
  ],
  [AppealChallengeDetailTransactionTypes.RESOLVE]: [
    "Your appeal challenge was submitted",
    <>
      <ModalContent>
        Voters can now collect rewards from their votes on this challeng and appeal challengee, if they are available.
      </ModalContent>,
    </>,
  ],
};

export interface AppealChallengeDetailProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  challengeID: BigNumber;
  challenge: ChallengeData;
  appealChallengeID: BigNumber;
  appealChallenge: AppealChallengeData;
  userAppealChallengeData?: UserChallengeData;
  appeal: AppealData;
  parameters: any;
  govtParameters: any;
  tokenBalance: number;
  user: any;
}

export interface ChallengeVoteState {
  voteOption?: string;
  salt?: string;
  numTokens?: string;
  isReviewVoteModalOpen: boolean;
}

export interface AppealChallengeDetailProgressModalPropsState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionType?: number;
  transactions?: any[];
  cancelTransaction?(): void;
}

class AppealChallengeDetail extends React.Component<
  AppealChallengeDetailProps,
  ChallengeVoteState & AppealChallengeDetailProgressModalPropsState
> {
  constructor(props: AppealChallengeDetailProps) {
    super(props);
    const fetchedVote = fetchVote(this.props.appealChallengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    this.state = {
      voteOption,
      salt: fetchSalt(this.props.appealChallengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      isReviewVoteModalOpen: false,
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionType: undefined,
    };
  }

  public render(): JSX.Element {
    const challenge = this.props.appealChallenge;
    const canResolveChallenge =
      !isAppealChallengeInCommitStage(challenge) && !isAppealChallengeInRevealStage(challenge) && !challenge.resolved;
    return (
      <>
        {isAppealChallengeInCommitStage(challenge) && this.renderCommitStage()}
        {isAppealChallengeInRevealStage(challenge) && this.renderRevealStage()}
        {canResolveChallenge && this.renderResolveAppealChallenge()}
        {this.renderAwaitingTransactionModal()}
        {this.renderTransactionProgressModal()}
        {this.renderTransactionSuccessModal()}
      </>
    );
  }

  private renderCommitStage(): JSX.Element {
    const challenge = this.props.appealChallenge;

    const endTime = challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.challengeAppealCommitLen;
    const secondaryPhaseLength = this.props.parameters.challengeAppealRevealLen;

    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

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

    return (
      <>
        <AppealChallengeCommitVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          secondaryPhaseLength={secondaryPhaseLength}
          challengeID={this.props.challengeID.toString()}
          challenger={challenger}
          rewardPool={rewardPool}
          stake={stake}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          onInputChange={this.updateCommitVoteState}
          tokenBalance={this.props.tokenBalance}
          salt={this.state.salt}
          numTokens={this.state.numTokens}
          onReviewVote={this.handleReviewVote}
          appealChallengeID={this.props.appealChallengeID.toString()}
          appealGranted={this.props.appeal.appealGranted}
        />
        {this.renderReviewVoteModal()}
      </>
    );
  }

  private renderRevealStage(): JSX.Element {
    const challenge = this.props.appealChallenge;
    const userHasRevealedVote =
      this.props.userAppealChallengeData && !!this.props.userAppealChallengeData.didUserReveal;
    const userHasCommittedVote =
      this.props.userAppealChallengeData && !!this.props.userAppealChallengeData.didUserCommit;

    const endTime = challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.challengeAppealRevealLen;
    const secondaryPhaseLength = this.props.parameters.challengeAppealCommitLen;

    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: AppealChallengeDetailTransactionTypes.REVEAL_VOTE,
          });
          return this.revealVoteOnChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
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

    return (
      <>
        <AppealChallengeRevealVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          secondaryPhaseLength={secondaryPhaseLength}
          challengeID={this.props.challengeID.toString()}
          challenger={challenger}
          rewardPool={rewardPool}
          userHasRevealedVote={userHasRevealedVote}
          userHasCommittedVote={userHasCommittedVote}
          stake={stake}
          voteOption={this.state.voteOption}
          salt={this.state.salt}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          onInputChange={this.updateCommitVoteState}
          transactions={transactions}
          appealChallengeID={this.props.appealChallengeID.toString()}
          appealGranted={this.props.appeal.appealGranted}
        />
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderResolveAppealChallenge(): JSX.Element {
    const appealGranted = this.props.appeal.appealGranted;
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
    const challenger = challenge.challenger.toString();
    const rewardPool = getFormattedTokenBalance(challenge.rewardPool);
    const stake = getFormattedTokenBalance(challenge.stake);

    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: AppealChallengeDetailTransactionTypes.RESOLVE,
          });
          return this.resolve();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
      },
    ];

    return (
      <>
        <AppealChallengeResolveCard
          challengeID={this.props.challengeID.toString()}
          challenger={challenger}
          rewardPool={rewardPool}
          stake={stake}
          appealChallengeID={this.props.appealChallengeID.toString()}
          appealGranted={appealGranted}
          transactions={transactions}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          appealChallengeTotalVotes={getFormattedTokenBalance(appealChallengeTotalVotes)}
          appealChallengeVotesFor={appealChallengeVotesFor}
          appealChallengeVotesAgainst={appealChallengeVotesAgainst}
          appealChallengePercentFor={appealChallengePercentFor.toString()}
          appealChallengePercentAgainst={appealChallengePercentAgainst.toString()}
        />
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderReviewVoteModal(): JSX.Element {
    const { challenge } = this.props;
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: AppealChallengeDetailTransactionTypes.APPROVE_VOTING_RIGHTS,
          });
          return this.approveVotingRights();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
      },
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: AppealChallengeDetailTransactionTypes.COMMIT_VOTE,
          });
          return this.commitVoteOnChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
          });
        },
        postTransaction: () => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: true,
          });
        },
        handleTransactionError: this.handleTransactionError,
      },
    ];

    const listingDetailURL = `https://${window.location.hostname}/listing/${this.props.listingAddress}`;

    const props: ReviewVoteProps = {
      newsroomName: (this.props.newsroom && this.props.newsroom.data.name) || "this newsroom",
      listingDetailURL,
      challengeID: this.props.appealChallengeID.toString(),
      open: this.state.isReviewVoteModalOpen,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
      voteOption: this.state.voteOption,
      userAccount: this.props.user,
      commitEndDate: challenge.poll.commitEndDate.toNumber(),
      revealEndDate: challenge.poll.revealEndDate.toNumber(),
      transactions,
      postExecuteTransactions: this.closeReviewVoteModal,
      handleClose: this.closeReviewVoteModal,
    };

    return <ReviewVote {...props} />;
  }

  private updateCommitVoteState = (data: any): void => {
    this.setState({ ...data });
  };

  private renderTransactionSuccessModal(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    const successLabel = AppealChallengeDetailTransactionSuccessLabels[this.state.transactionType!];
    return (
      <Modal>
        <ModalHeading>
          <strong>
            Success!<br />
            {successLabel[0]}
          </strong>
        </ModalHeading>
        {successLabel[1]}
        <Button size={buttonSizes.MEDIUM} onClick={this.closeAllModals}>
          Ok, got it
        </Button>
      </Modal>
    );
  }

  private renderAwaitingTransactionModal(): JSX.Element | null {
    if (!this.state.isWaitingTransactionModalOpen) {
      return null;
    }
    const transactionLabel = AppealChallengeDetailTransactionLabels[this.state.transactionType!];
    const stepLabelText = MultiStepTransactionLabels[this.state.transactionType!] || "1 of 1";
    const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
    return (
      <MetaMaskModal waiting={true}>
        <ModalStepLabel>{stepLabel}</ModalStepLabel>
        <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  private renderTransactionProgressModal(): JSX.Element | null {
    if (!this.state.isTransactionProgressModalOpen) {
      return null;
    }
    const transactionLabel = AppealChallengeDetailTransactionLabels[this.state.transactionType!];
    const stepLabelText = MultiStepTransactionLabels[this.state.transactionType!] || "1 of 1";
    const stepLabel = `Step ${stepLabelText} - ${transactionLabel}`;
    return (
      <Modal>
        <ProgressModalContentInProgress>
          <ModalStepLabel>{stepLabel}</ModalStepLabel>
          <ModalHeading>{transactionLabel}</ModalHeading>
        </ProgressModalContentInProgress>
      </Modal>
    );
  }

  private renderTransactionRejectionModal(transactions: any[], cancelTransaction: () => void): JSX.Element | null {
    if (!this.state.isTransactionRejectionModalOpen) {
      return null;
    }

    const denialMessage = AppealChallengeDetailTransactionRejectionLabels[this.state.transactionType!];

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText={denialMessage[1]}
        cancelTransaction={cancelTransaction}
        denialRestartTransactions={transactions}
      >
        <ModalHeading>{denialMessage[0]}</ModalHeading>
      </MetaMaskModal>
    );
  }

  private cancelTransaction = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
    });
  };

  private handleTransactionError = (err: Error) => {
    const isErrorUserRejection = err.message === "Error: MetaMask Tx Signature: User denied transaction signature.";
    this.setState(() => ({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: isErrorUserRejection,
    }));
  };

  private closeAllModals = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionType: undefined,
    });
  };

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber((this.state.numTokens as string).replace(",", "")).mul(1e18);
    return approveVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber((this.state.numTokens as string).replace(",", "")).mul(1e18);
    saveVote(this.props.appealChallengeID, this.props.user, voteOption);
    return commitVote(this.props.appealChallengeID, voteOption, salt, numTokens);
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.appealChallengeID, voteOption, salt);
  };

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };

  private handleReviewVote = () => {
    this.setState({ isReviewVoteModalOpen: true });
  };

  private closeReviewVoteModal = () => {
    this.setState({ isReviewVoteModalOpen: false });
  };
}

export default AppealChallengeDetail;
