import * as React from "react";
import { compose } from "redux";
import { formatRoute } from "react-router-named-routes";
import { BigNumber, formatEther, bigNumberify, parseEther, TxHash } from "@joincivil/typescript-types";
import { TwoStepEthTransaction } from "@joincivil/core";
import {
  AppealChallengeCommitVoteCard as AppealChallengeCommitVoteCardComponent,
  AppealChallengeCommitVoteCardProps,
  CommitVoteSuccessIcon,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  ReviewVote,
  ReviewVoteProps,
} from "@joincivil/components";
import { getFormattedTokenBalance, Parameters, urlConstants as links } from "@joincivil/utils";

import { routes } from "../../constants";
import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { fetchSalt } from "../../helpers/salt";
import { saveVote } from "../../helpers/vote";
import {
  ChallengeContainerProps,
  connectChallengePhase,
  connectChallengeResults,
  connectParameters,
} from "../utility/HigherOrderComponents";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import { AppealChallengeDetailProps, ChallengeVoteState } from "./AppealChallengeDetail";

enum TransactionTypes {
  APPROVE_VOTING_RIGHTS = "APPROVE_VOTING_RIGHTS",
  COMMIT_VOTE = "COMMIT_VOTE",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "Approve Voting Rights",
  [TransactionTypes.COMMIT_VOTE]: "Commit Vote",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: "1 of 2",
  [TransactionTypes.COMMIT_VOTE]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [undefined, undefined],
  [TransactionTypes.COMMIT_VOTE]: [
    <>
      ,
      <CommitVoteSuccessIcon />
      <div>Your vote was committed!</div>
    </>,
    <>
      <ModalContent>
        Please keep your secret phrase safe. You will need it to confirm your vote. Votes can not be counted and rewards
        can not be claimed unless you confirm them.
      </ModalContent>
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "Your vote was not committed",
    "Before committing a vote, you need to confirm the approval of your voting token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.COMMIT_VOTE]: [
    "Your vote was not committed",
    "To commit a vote, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_VOTING_RIGHTS]: [
    "The was an problem with commiting your vote",
    <>
      <ModalContent>Please check the following and retry your transaction</ModalContent>
      <ModalUnorderedList>
        <ModalListItem>The number of tokens you are voting with does not exceed your available balance.</ModalListItem>
      </ModalUnorderedList>
    </>,
  ],
  [TransactionTypes.COMMIT_VOTE]: [
    "The was an problem with commiting your vote",
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

interface AppealCommitCardKeyState {
  key: number;
}

const AppealChallengeCommitVoteCard = compose<
  React.ComponentClass<ChallengeContainerProps & Partial<AppealChallengeCommitVoteCardProps>>
>(
  connectChallengePhase,
  connectChallengeResults,
  connectParameters,
)(AppealChallengeCommitVoteCardComponent);

class AppealChallengeCommitVote extends React.Component<
  AppealChallengeDetailProps & InjectedTransactionStatusModalProps,
  ChallengeVoteState & AppealCommitCardKeyState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  constructor(props: any) {
    super(props);
    this.state = {
      isReviewVoteModalOpen: false,
      voteOption: undefined,
      numTokens: undefined,
      key: new Date().valueOf(),
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.handleCommitVoteSuccessClose);
  }

  public render(): JSX.Element | null {
    const { appealChallenge } = this.props;

    const endTime = appealChallenge.poll.commitEndDate.toNumber();
    const phaseLength = this.props.parameters.get(Parameters.challengeAppealCommitLen);

    const tokenBalance = parseFloat(formatEther(this.props.balance || bigNumberify(0)));
    const votingTokenBalance = parseFloat(formatEther(this.props.votingBalance || bigNumberify(0)));
    const tokenBalanceDisplay = this.props.balance ? getFormattedTokenBalance(this.props.balance) : "";
    const votingTokenBalanceDisplay = this.props.votingBalance
      ? getFormattedTokenBalance(this.props.votingBalance)
      : "";

    const salt = fetchSalt(this.props.challengeID, this.props.user);

    const userHasCommittedVote =
      this.props.userAppealChallengeData && !!this.props.userAppealChallengeData.didUserCommit;

    const props = {
      endTime,
      phaseLength,
      challengeID: this.props.challengeID.toString(),
      userHasCommittedVote,
      onCommitMaxTokens: () => this.commitMaxTokens(),
      tokenBalance,
      votingTokenBalance,
      tokenBalanceDisplay,
      votingTokenBalanceDisplay,
      salt,
      voteOption: this.state.voteOption,
      numTokens: this.state.numTokens,
      onInputChange: this.updateCommitVoteState,
      onReviewVote: this.handleReviewVote,
      appealChallengeID: this.props.appealChallengeID.toString(),
      appealGranted: this.props.appeal.appealGranted,
      key: this.state.key,
      onMobileTransactionClick: this.props.onMobileTransactionClick,
      appealGrantedStatementURI: this.props.appeal.appealGrantedStatementURI,
      faqURL: links.FAQ_VOTING_SECTION,
    };

    return (
      <>
        <AppealChallengeCommitVoteCard {...props} />
        {this.renderReviewVoteModal()}
      </>
    );
  }

  private commitMaxTokens(): void {
    let numTokens: BigNumber;
    if (!this.props.votingBalance!.isZero()) {
      numTokens = this.props.votingBalance!;
    } else {
      numTokens = this.props.balance!.add(this.props.votingBalance!);
    }
    const numTokensString = formatEther(numTokens);
    this.setState(() => ({ numTokens: numTokensString }));
  }

  private renderReviewVoteModal(): JSX.Element {
    const { challenge } = this.props;
    const transactions = this.getTransactions();

    const relativeListingDetailURL = formatRoute(routes.LISTING, { listingAddress: this.props.listingAddress });
    const listingDetailURL = `https://${window.location.hostname}${relativeListingDetailURL}`;

    const salt = fetchSalt(this.props.challengeID, this.props.user);

    const props: ReviewVoteProps = {
      newsroomName: "this newsroom",
      listingDetailURL,
      challengeID: this.props.appealChallengeID.toString(),
      open: this.state.isReviewVoteModalOpen,
      salt,
      numTokens: this.state.numTokens,
      voteOption: this.state.voteOption,
      userAccount: this.props.user,
      commitEndDate: challenge.poll.commitEndDate.toNumber(),
      revealEndDate: challenge.poll.revealEndDate.toNumber(),
      transactions,
      postExecuteTransactions: this.closeReviewVoteModal,
      handleClose: this.closeReviewVoteModal,
      gasFaqURL: links.FAQ_GAS,
      votingContractFaqURL: links.FAQ_WHAT_IS_PLCR_CONTRACT,
    };

    return <ReviewVote {...props} />;
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
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
            transactionType: TransactionTypes.COMMIT_VOTE,
          });
          return this.commitVoteOnChallenge();
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
    this.props.updateTransactionStatusModalsState({ isTransactionSuccessModalOpen: false });
    this.setState({ isReviewVoteModalOpen: false, key: new Date().valueOf() });
  };

  private approveVotingRights = async (): Promise<TwoStepEthTransaction<any> | void> => {
    const numTokens = parseEther(this.state.numTokens!.toString());
    return this.context.approveVotingRightsForCommit(numTokens);
  };

  private commitVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const pollID = this.props.appealChallengeID;
    const saltStr = fetchSalt(pollID, this.props.user);
    const salt: BigNumber = new BigNumber(saltStr as string);
    const numTokens: BigNumber = parseEther(this.state.numTokens!.toString());
    saveVote(pollID, this.props.user, voteOption);
    return this.context.commitVote(pollID, voteOption, salt, numTokens);
  };
}

export default compose<React.ComponentClass<AppealChallengeDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(AppealChallengeCommitVote);
