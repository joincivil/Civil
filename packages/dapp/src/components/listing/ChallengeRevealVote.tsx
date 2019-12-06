import * as React from "react";
import { compose } from "redux";
import { BigNumber, TxHash } from "@joincivil/typescript-types";
import { TwoStepEthTransaction } from "@joincivil/core";
import {
  ChallengeRevealVoteCard as ChallengeRevealVoteCardComponent,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
  RevealVoteSuccessIcon,
  PhaseWithExpiryProps,
  ListingDetailPhaseCardComponentProps,
  ChallengePhaseProps,
  RevealVoteProps,
} from "@joincivil/components";
import { getLocalDateTimeStrings, urlConstants as links, Parameters } from "@joincivil/utils";

import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { fetchSalt } from "../../helpers/salt";
import { fetchVote } from "../../helpers/vote";
import { ChallengeContainerProps, connectChallengePhase, ParametersProps } from "../utility/HigherOrderComponents";
import {
  InjectedTransactionStatusModalProps,
  hasTransactionStatusModals,
  TransactionStatusModalContentMap,
} from "../utility/TransactionStatusModalsHOC";
import { ChallengeDetailProps, ChallengeVoteState } from "./ChallengeDetail";

const ChallengeRevealVoteCard = compose<
  React.ComponentType<
    ListingDetailPhaseCardComponentProps &
      PhaseWithExpiryProps &
      ChallengePhaseProps &
      ChallengeContainerProps &
      RevealVoteProps
  >
>(connectChallengePhase)(ChallengeRevealVoteCardComponent);

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

interface RevealCardKeyState {
  key: number;
}

class ChallengeRevealVote extends React.Component<
  ChallengeDetailProps & InjectedTransactionStatusModalProps & ParametersProps,
  ChallengeVoteState & RevealCardKeyState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  constructor(props: ChallengeDetailProps & InjectedTransactionStatusModalProps & ParametersProps) {
    super(props);
    this.state = {
      voteOption: this.getVoteOption(),
      salt: fetchSalt(this.props.challengeID, this.props.user),
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
    const endTime = this.props.challenge.poll.revealEndDate.toNumber();
    const phaseLength = this.props.parameters.get(Parameters.revealStageLen).toNumber();
    const secondaryPhaseLength = this.props.parameters.get(Parameters.commitStageLen).toNumber();
    const challenge = this.props.challenge;
    const userHasRevealedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserReveal;
    const userHasCommittedVote = this.props.userChallengeData && !!this.props.userChallengeData.didUserCommit;
    const transactions = this.getTransactions();

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
          voteOption={this.state.voteOption}
          salt={this.state.salt}
          onInputChange={this.updateRevealVoteState}
          onMobileTransactionClick={this.props.onMobileTransactionClick}
          faqURL={links.FAQ_VOTING_SECTION}
          votingSmartContractFaqURL={links.FAQ_WHAT_IS_PLCR_CONTRACT}
          userHasRevealedVote={userHasRevealedVote}
          userHasCommittedVote={userHasCommittedVote}
          transactions={transactions}
          key={this.state.key}
        />
      </>
    );
  }

  private getVoteOption(): string | undefined {
    const fetchedVote = fetchVote(this.props.challengeID, this.props.user);
    let voteOption;
    if (fetchedVote) {
      voteOption = fetchedVote.toString();
    }
    return voteOption;
  }

  private getTransactionSuccessContent = (): TransactionStatusModalContentMap => {
    const endTime = getLocalDateTimeStrings(this.props.challenge.poll.revealEndDate.toNumber());
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

  private handleRevealVoteSuccessClose = (): void => {
    this.props.updateTransactionStatusModalsState({ isTransactionSuccessModalOpen: false });
    this.setState({ isReviewVoteModalOpen: false, key: new Date().valueOf() });
  };

  private revealVoteOnChallenge = async (): Promise<TwoStepEthTransaction<any>> => {
    const voteOption: BigNumber = new BigNumber(this.state.voteOption as string);
    const salt: BigNumber = new BigNumber(this.state.salt as string);
    return this.context.revealVote(this.props.challengeID, voteOption, salt);
  };

  private updateRevealVoteState = (data: any, callback?: () => void): void => {
    if (callback) {
      this.setState({ ...data }, callback);
    } else {
      this.setState({ ...data });
    }
  };
}

export default compose<React.ComponentClass<ChallengeDetailProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeRevealVote);
