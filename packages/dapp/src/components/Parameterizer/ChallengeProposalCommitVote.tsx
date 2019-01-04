import * as React from "react";
import { compose } from "redux";
import BigNumber from "bignumber.js";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  ChallengeProposalCommitVote as ChallengeProposalCommitVoteComponent,
  TChallengeProposalCommitVoteProps as ChallengeProposalCommitVoteComponentProps,
  ChallengeProposalReviewVote,
  ChallengeProposalReviewVoteProps,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
} from "@joincivil/components";

import { approveVotingRights, commitVote } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { fetchSalt } from "../../helpers/salt";
import { saveVote } from "../../helpers/vote";

import { ChallengeDetailProps, ChallengeVoteState } from "./ChallengeProposalDetail";

enum TransactionTypes {
  APPROVE_VOTING_RIGHTS = "APPROVE_VOTING_RIGHTS",
  COMMIT_VOTE = "COMMIT_VOTE",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "Approve For Proposal Challenge",
  [TransactionTypes.COMMIT_VOTE]: "Challenge Proposal",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "1 of 2",
  [TransactionTypes.COMMIT_VOTE]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [undefined, undefined],
  [TransactionTypes.COMMIT_VOTE]: [
    "Your proposal challenge was submitted!",
    <>
      <ModalContent />
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "There was a problem with your proposal challenge",
    "Before proposing a new value, you need to confirm the approval of your proposal challenge token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.COMMIT_VOTE]: [
    "Your proposal challenge was not submitted",
    "To submit a proposal challenge, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "There was a problem with your proposal challenge",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>
          You have sufficient CVL in your account for the Parameter Proposal Challenge Deposit
        </ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.COMMIT_VOTE]: [
    "The was an problem with submitting your proposal challenge",
    <>
      <ModalContent>Please retry your transaction</ModalContent>
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

class ChallengeProposalCommitVote extends React.Component<
  ChallengeDetailProps & ChallengeProposalCommitVoteComponentProps & InjectedTransactionStatusModalProps,
  ChallengeVoteState
> {
  public constructor(
    props: ChallengeDetailProps & ChallengeProposalCommitVoteComponentProps & InjectedTransactionStatusModalProps,
  ) {
    super(props);
    this.state = {
      isReviewVoteModalOpen: false,
      voteOption: undefined,
      salt: fetchSalt(this.props.challengeID, this.props.user),
      numTokens: undefined,
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);
  }

  public render(): JSX.Element {
    const challengeProposalCommitVoteProps = {
      ...this.props,
      numTokens: this.state.numTokens,
      onInputChange: this.updateCommitVoteState,
      onCommitMaxTokens: () => this.commitMaxTokens(),
      challengeID: this.props.challengeID.toString(),
      onReviewVote: this.handleReviewVote,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onChallengeProposalCommitVoteSuccess,
    };

    return (
      <>
        <ChallengeProposalCommitVoteComponent {...challengeProposalCommitVoteProps} />
        {this.renderReviewVoteModal()}
      </>
    );
  }

  private renderReviewVoteModal(): JSX.Element {
    const { challenge } = this.props;
    const proposalURL = `https://${window.location.hostname}/parameterizer/${this.props.propID}`;

    const props: ChallengeProposalReviewVoteProps = {
      parameterName: this.props.parameterDisplayName,
      proposalURL,
      challengeID: this.props.challengeID.toString(),
      open: this.state.isReviewVoteModalOpen,
      salt: this.state.salt,
      numTokens: this.state.numTokens,
      voteOption: this.state.voteOption,
      userAccount: this.props.user,
      commitEndDate: challenge.poll.commitEndDate.toNumber(),
      revealEndDate: challenge.poll.revealEndDate.toNumber(),
      transactions: this.getTransactions(),
      postExecuteTransactions: this.closeReviewModalAndChallengeDrawer,
      handleClose: this.closeReviewVoteModal,
    };

    return <ChallengeProposalReviewVote {...props} />;
  }

  private updateCommitVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data }, () => {
        console.log(this.state);
      });
    }
  };

  private commitMaxTokens(): void {
    console.log(this, this.props);
    let numTokens: BigNumber;
    if (!this.props.votingBalance!.isZero()) {
      numTokens = this.props.votingBalance!;
    } else {
      numTokens = this.props.balance!.add(this.props.votingBalance!);
    }
    const numTokensString = numTokens
      .div(1e18)
      .toFixed(2)
      .toString();
    this.setState(() => ({ numTokens: numTokensString }));
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            isTransactionErrorModalOpen: false,
            isTransactionRejectionModalOpen: false,
            transactionType: TransactionTypes.APPROVE_VOTING_RIGHTS,
          });
          return this.approveVotingRights();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: false,
            isTransactionProgressModalOpen: true,
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
            transactionType: TransactionTypes.COMMIT_VOTE,
          });
          return this.commitVoteOnChallenge();
        },
        handleTransactionHash: (txHash: TxHash) => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
          });
        },
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private onChallengeProposalCommitVoteSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
    this.props.handleClose();
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

  private handleReviewVote = () => {
    this.setState({ isReviewVoteModalOpen: true });
  };

  private closeReviewVoteModal = () => {
    this.setState({ isReviewVoteModalOpen: false });
  };

  private closeReviewModalAndChallengeDrawer = () => {
    this.setState({ isReviewVoteModalOpen: false }, () => {
      this.props.handleClose();
    });
  };
}

export default compose<React.ComponentClass<ChallengeDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeProposalCommitVote);
