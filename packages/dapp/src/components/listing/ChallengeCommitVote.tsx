import * as React from "react";
import BigNumber from "bignumber.js";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  Button,
  buttonSizes,
  ChallengeCommitVoteCard,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ProgressModalContentInProgress,
  ReviewVote,
  ReviewVoteProps,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { commitVote, approveVotingRights } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";
import { saveVote } from "../../helpers/vote";
import { ChallengeDetailProps, ChallengeVoteState, ProgressModalPropsState } from "./ChallengeDetail";

class ChallengeCommitVote extends React.Component<ChallengeDetailProps, ChallengeVoteState & ProgressModalPropsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isReviewVoteModalOpen: false,
      voteOption: undefined,
      salt: fetchSalt(this.props.challengeID, this.props.user),
      numTokens: undefined,
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionIndex: -1,
    };
  }

  public componentDidMount(): void {
    if (!this.state.numTokens && this.props.balance && this.props.votingBalance) {
      this.setInitNumTokens();
    }
  }

  public componentDidUpdate(prevProps: ChallengeDetailProps): void {
    if (!this.state.numTokens && (this.props.balance && this.props.votingBalance)) {
      this.setInitNumTokens();
    }
  }

  public render(): JSX.Element | null {
    const endTime = this.props.challenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.commitStageLen;
    const challenge = this.props.challenge;
    const tokenBalance = this.props.balance ? this.props.balance.toNumber() : 0;
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;

    if (!challenge) {
      return null;
    }

    return (
      <>
        <ChallengeCommitVoteCard
          endTime={endTime}
          phaseLength={phaseLength}
          challenger={challenge!.challenger.toString()}
          challengeID={this.props.challengeID.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          userHasCommittedVote={userHasCommittedVote}
          onInputChange={this.updateCommitVoteState}
          onReviewVote={this.handleReviewVote}
          tokenBalance={tokenBalance}
          salt={this.state.salt}
          numTokens={this.state.numTokens}
        />
        {this.renderReviewVoteModal()}
      </>
    );
  }

  private setInitNumTokens(): void {
    let initNumTokens: BigNumber;
    if (!this.props.votingBalance!.isZero()) {
      initNumTokens = this.props.votingBalance!;
    } else {
      initNumTokens = this.props.balance!.add(this.props.votingBalance!);
    }
    const initNumTokensString = initNumTokens
      .div(1e18)
      .toFixed(2)
      .toString();
    this.setState(() => ({ numTokens: initNumTokensString }));
  }

  private renderReviewVoteModal(): JSX.Element {
    if (!this.props.parameters) {
      return <></>;
    }

    const { challenge } = this.props;
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionIndex: 0,
          });
          return this.approveVotingRights();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.setState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
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
            transactionIndex: 1,
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
      newsroomName: this.props.newsroom && this.props.newsroom.data.name,
      listingDetailURL,
      challengeID: this.props.challengeID.toString(),
      open: this.state.isReviewVoteModalOpen!,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
      voteOption: this.state.voteOption,
      userAccount: this.props.user,
      commitEndDate: challenge.poll.commitEndDate.toNumber(),
      revealEndDate: challenge.poll.revealEndDate.toNumber(),
      transactions,
      handleClose: this.closeReviewVoteModal,
    };

    return (
      <>
        <ReviewVote {...props} />
        {this.renderAwaitingTransactionModal()}
        {this.renderTransactionProgressModal()}
        {this.renderCommitVoteSuccess()}
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderAwaitingTransactionModal(): JSX.Element | null {
    if (!this.state.isWaitingTransactionModalOpen) {
      return null;
    }
    const { transactionIndex } = this.state;
    let transactionLabel = "";
    let stepLabelText = "";
    if (transactionIndex === 0) {
      transactionLabel = "Approve Voting Rights";
      stepLabelText = `Step 1 of 2 - ${transactionLabel}`;
    } else if (transactionIndex === 1) {
      transactionLabel = "Commit Vote";
      stepLabelText = `Step 2 of 2 - ${transactionLabel}`;
    }
    return (
      <MetaMaskModal waiting={true}>
        <ModalStepLabel>{stepLabelText}</ModalStepLabel>
        <ModalHeading>Waiting for you to confirm in MetaMask</ModalHeading>
      </MetaMaskModal>
    );
  }

  private renderTransactionProgressModal(): JSX.Element | null {
    if (!this.state.isTransactionProgressModalOpen) {
      return null;
    }
    const { transactionIndex } = this.state;
    let transactionLabel = "";
    let stepLabelText = "";
    if (transactionIndex === 0) {
      transactionLabel = "Approve Voting Rights";
      stepLabelText = `Step 1 of 2 - ${transactionLabel}`;
    } else if (transactionIndex === 1) {
      transactionLabel = "Commit Vote";
      stepLabelText = `Step 2 of 2 - ${transactionLabel}`;
    }
    return (
      <Modal>
        <ProgressModalContentInProgress>
          <ModalStepLabel>{stepLabelText}</ModalStepLabel>
          <ModalHeading>{transactionLabel}</ModalHeading>
        </ProgressModalContentInProgress>
      </Modal>
    );
  }

  private renderCommitVoteSuccess(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    return (
      <Modal>
        <ModalHeading>
          <strong>Vote Committed!</strong>
        </ModalHeading>
        <ModalContent>
          Please keep your secret phrase safe. You will need it to confirm your vote. Votes can not be counted and
          rewards can not be claimed unless you confirm them.
        </ModalContent>
        <Button size={buttonSizes.MEDIUM} onClick={this.handleCommitVoteSuccessClose}>
          Ok, got it
        </Button>
      </Modal>
    );
  }

  private renderTransactionRejectionModal(transactions: any[], cancelTransaction: () => void): JSX.Element | null {
    if (!this.state.isTransactionRejectionModalOpen) {
      return null;
    }

    const { transactionIndex } = this.state;
    const message = "Your vote was not committed";
    let denialMessage = "";

    if (transactionIndex === 0) {
      denialMessage =
        "Before committing a vote, you need to confirm the approval of your voting token deposit in your MetaMask wallet.";
    } else if (transactionIndex === 1) {
      denialMessage = "To commit a vote, you need to confirm the transaction in your MetaMask wallet.";
    }

    return (
      <MetaMaskModal
        waiting={false}
        denied={true}
        denialText={denialMessage}
        cancelTransaction={cancelTransaction}
        denialRestartTransactions={transactions}
      >
        <ModalHeading>{message}</ModalHeading>
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

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

  private handleReviewVote = () => {
    this.setState({ isReviewVoteModalOpen: true });
  };

  private closeReviewVoteModal = () => {
    this.setState({ isReviewVoteModalOpen: false });
  };

  private handleCommitVoteSuccessClose = () => {
    this.setState({ isTransactionSuccessModalOpen: false, isReviewVoteModalOpen: false });
  };

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    return approveVotingRights(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    const numTokens: BigNumber = new BigNumber(this.state.numTokens as string).mul(1e18);
    saveVote(this.props.challengeID, this.props.user, voteOption);
    return commitVote(this.props.challengeID, voteOption, salt, numTokens);
  };
}

export default ChallengeCommitVote;
