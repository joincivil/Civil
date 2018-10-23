import * as React from "react";
import BigNumber from "bignumber.js";
import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  Button,
  buttonSizes,
  ChallengeRevealVoteCard,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ModalUnorderedList,
  ModalListItem,
  ProgressModalContentError,
  ProgressModalContentInProgress,
} from "@joincivil/components";
import { getLocalDateTimeStrings, getFormattedTokenBalance } from "@joincivil/utils";
import { revealVote } from "../../apis/civilTCR";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote } from "../../helpers/vote";
import { ChallengeDetailProps, ChallengeVoteState, ProgressModalPropsState } from "./ChallengeDetail";

class ChallengeRevealVote extends React.Component<ChallengeDetailProps, ChallengeVoteState & ProgressModalPropsState> {
  constructor(props: ChallengeDetailProps) {
    super(props);
    const fetchedVote = fetchVote(this.props.challengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    this.state = {
      isReviewVoteModalOpen: false,
      voteOption,
      salt: fetchSalt(this.props.challengeID, this.props.user), // TODO(jorgelo): This should probably be in redux.
      numTokens: undefined,
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionErrorModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionIndex: -1,
    };
  }

  public render(): JSX.Element | null {
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters.revealStageLen;
    const secondaryPhaseLength = this.props.parameters.commitStageLen;
    const challenge = this.props.challenge;
    const userHasRevealedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserReveal;
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionIndex: 0,
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

    if (!challenge) {
      return null;
    }

    return (
      <>
        <ChallengeRevealVoteCard
          challengeID={this.props.challengeID.toString()}
          endTime={endTime}
          phaseLength={phaseLength}
          secondaryPhaseLength={secondaryPhaseLength}
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          voteOption={this.state.voteOption}
          salt={this.state.salt}
          onInputChange={this.updateCommitVoteState}
          userHasRevealedVote={userHasRevealedVote}
          userHasCommittedVote={userHasCommittedVote}
          transactions={transactions}
        />
        {this.renderAwaitingTransactionModal()}
        {this.renderTransactionProgressModal()}
        {this.renderRevealVoteSuccess()}
        {this.renderTransactionErrorModal()}
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderRevealVoteSuccess(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    const endTime = getLocalDateTimeStrings(this.props.challenge.poll.revealEndDate.toNumber());
    return (
      <Modal>
        <ModalHeading>
          <strong>Success! Thanks for confirming your vote.</strong>
        </ModalHeading>
        <ModalContent>
          We are still waiting for all voters to confirm their votes. Please check back after{" "}
          <strong>
            {endTime[0]} {endTime[1]}
          </strong>{" "}
          to see voting results. Thank you for your patience!
        </ModalContent>
        <Button size={buttonSizes.MEDIUM} onClick={this.handleRevealVoteSuccessClose}>
          Ok, got it
        </Button>
      </Modal>
    );
  }

  private renderAwaitingTransactionModal(): JSX.Element | null {
    if (!this.state.isWaitingTransactionModalOpen) {
      return null;
    }
    const transactionLabel = "Confirm Vote";
    const stepLabelText = `Step 1 of 1 - ${transactionLabel}`;
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
    const transactionLabel = "Confirm Vote";
    const stepLabelText = `Step 1 of 1 - ${transactionLabel}`;
    return (
      <Modal>
        <ProgressModalContentInProgress>
          <ModalStepLabel>{stepLabelText}</ModalStepLabel>
          <ModalHeading>{transactionLabel}</ModalHeading>
        </ProgressModalContentInProgress>
      </Modal>
    );
  }

  private renderTransactionRejectionModal(transactions: any[], cancelTransaction: () => void): JSX.Element | null {
    if (!this.state.isTransactionRejectionModalOpen) {
      return null;
    }

    const message = "Your vote was not confirmed";
    const denialMessage = "To confirm your vote, you need to confirm the transaction in your MetaMask wallet.";

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

  private renderTransactionErrorModal(): JSX.Element | null {
    if (!this.state.isTransactionErrorModalOpen) {
      return null;
    }

    return (
      <ProgressModalContentError>
        <ModalHeading>The was an problem with revealing your vote</ModalHeading>
        <ModalContent>Please check the following and retry your transaction</ModalContent>
        <ModalUnorderedList>
          <ModalListItem>Your vote selection matches the vote you committed</ModalListItem>
          <ModalListItem>Your secret phrase is correct</ModalListItem>
        </ModalUnorderedList>
      </ProgressModalContentError>
    );
  }

  private cancelTransaction = (): void => {
    this.setState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionErrorModalOpen: false,
      isTransactionRejectionModalOpen: false,
    });
  };

  private handleTransactionError = (err: Error) => {
    const isErrorUserRejection = err.message === "Error: MetaMask Tx Signature: User denied transaction signature.";
    this.setState(() => ({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionErrorModalOpen: !isErrorUserRejection,
      isTransactionRejectionModalOpen: isErrorUserRejection,
    }));
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.challengeID, voteOption, salt);
  };

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

  private handleRevealVoteSuccessClose = () => {
    this.setState({ isTransactionSuccessModalOpen: false });
  };
}

export default ChallengeRevealVote;
