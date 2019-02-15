import * as React from "react";
import { compose } from "redux";
import { BigNumber } from "bignumber.js";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  ChallengeProposalRevealVote as ChallengeProposalRevealVoteComponent,
  TChallengeProposalRevealVoteProps as ChallengeProposalRevealVoteComponentProps,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
} from "@joincivil/components";
import { getLocalDateTimeStrings } from "@joincivil/utils";

import { revealVote } from "../../apis/civilTCR";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote } from "../../helpers/vote";

import { ChallengeDetailProps, ChallengeVoteState } from "./ChallengeProposalDetail";

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

class ChallengeProposalRevealVote extends React.Component<
  ChallengeDetailProps & ChallengeProposalRevealVoteComponentProps & InjectedTransactionStatusModalProps,
  ChallengeVoteState
> {
  constructor(
    props: ChallengeDetailProps & ChallengeProposalRevealVoteComponentProps & InjectedTransactionStatusModalProps,
  ) {
    super(props);
    this.state = {
      isReviewVoteModalOpen: false,
      voteOption: this.getVoteOption(),
      salt: fetchSalt(this.props.challengeID, this.props.user),
      numTokens: undefined,
    };
  }

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);

    const transactionSuccessContent = this.getTransactionSuccessContent();
    this.props.setTransactionStatusModalConfig({
      transactionSuccessContent,
    });
  }

  public render(): JSX.Element {
    const revealVoteProps = {
      ...this.props,
      onInputChange: this.updateRevealVoteState,
      voteOption: this.state.voteOption,
      salt: this.state.salt,
      challengeID: this.props.challengeID.toString(),
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onRevealVoteSuccess,
    };

    return <ChallengeProposalRevealVoteComponent {...revealVoteProps} />;
  }

  private getVoteOption(): string | undefined {
    const fetchedVote = fetchVote(this.props.challengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    return voteOption;
  }

  private updateRevealVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };

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
        handleTransactionError: this.props.handleTransactionError,
      },
    ];
  };

  private getTransactionSuccessContent = (): TransactionStatusModalContentMap => {
    const endTime = getLocalDateTimeStrings(this.props.challenge.poll.revealEndDate.toNumber());
    return {
      [TransactionTypes.REVEAL_VOTE]: [
        "Thanks for confirming your vote.",
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

  private onRevealVoteSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
    this.props.handleClose();
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return revealVote(this.props.challengeID, voteOption, salt);
  };
}

export default compose<React.ComponentClass<ChallengeDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeProposalRevealVote);
