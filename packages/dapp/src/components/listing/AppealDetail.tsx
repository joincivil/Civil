import * as React from "react";
import styled from "styled-components";
import {
  AppealData,
  ChallengeData,
  EthAddress,
  NewsroomWrapper,
  TwoStepEthTransaction,
  TxHash,
  UserChallengeData,
} from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";
import {
  Button,
  buttonSizes,
  AppealAwaitingDecisionCard,
  AppealResolveCard,
  AppealDecisionCard,
  MetaMaskModal,
  Modal,
  ModalHeading,
  ModalContent,
  ModalStepLabel,
  ProgressModalContentInProgress,
} from "@joincivil/components";
import BigNumber from "bignumber.js";
import {
  approveForChallengeGrantedAppeal,
  challengeGrantedAppeal,
  grantAppeal,
  updateStatus,
  confirmAppeal,
} from "../../apis/civilTCR";
import AppealChallengeDetail from "./AppealChallengeDetail";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

enum AppealDetailTransactionTypes {
  GRANT_APPEAL,
  RESOLVE_APPEAL,
  APPROVE_CHALLENGE_APPEAL,
  CHALLENGE_APPEAL,
  CONFIRM_APPEAL,
}

const AppealDetailTransactionLabels = {
  [AppealDetailTransactionTypes.GRANT_APPEAL]: "Grant Appeal",
  [AppealDetailTransactionTypes.CONFIRM_APPEAL]: "Confirm Appeal",
  [AppealDetailTransactionTypes.RESOLVE_APPEAL]: "Resolve Appeal",
  [AppealDetailTransactionTypes.APPROVE_CHALLENGE_APPEAL]: "Approve Challenge Appeal",
  [AppealDetailTransactionTypes.CHALLENGE_APPEAL]: "Challenge Appeal",
};

const MultiStepTransactionLabels = {
  [AppealDetailTransactionTypes.APPROVE_CHALLENGE_APPEAL]: "1 of 2",
  [AppealDetailTransactionTypes.CHALLENGE_APPEAL]: "2 of 2",
};

const denialSuffix = ", you need to confirm the transaction in your MetaMask wallet.";

const AppealDetailTransactionRejectionLabels = {
  [AppealDetailTransactionTypes.GRANT_APPEAL]: ["The appeal was not granted", `To grant the appeal${denialSuffix}`],
  [AppealDetailTransactionTypes.CONFIRM_APPEAL]: [
    "The appeal was not confirmed",
    `To confirm the appeal${denialSuffix}`,
  ],
  [AppealDetailTransactionTypes.RESOLVE_APPEAL]: [
    "The appeal was not resolved",
    `To resolve the appeal${denialSuffix}`,
  ],
  [AppealDetailTransactionTypes.APPROVE_CHALLENGE_APPEAL]: [
    "Your appeal challenge was not submitted",
    "Before submitting an appeal challenge, you need to confirm that you approve the appeal fee deposit",
  ],
  [AppealDetailTransactionTypes.CHALLENGE_APPEAL]: [
    "Your appeal challenge was not submitted",
    `To submit an appeal challenge${denialSuffix}`,
  ],
};

const AppealDetailTransactionSuccessLabels = {
  [AppealDetailTransactionTypes.GRANT_APPEAL]: ["The appeal was granted", null],
  [AppealDetailTransactionTypes.CONFIRM_APPEAL]: ["The appeal was confirmed", null],
  [AppealDetailTransactionTypes.RESOLVE_APPEAL]: [
    "The appeal was resolved",
    <ModalContent>
      Voters can now collect rewards from their votes on this challenge, if they are available.
    </ModalContent>,
  ],
  [AppealDetailTransactionTypes.CHALLENGE_APPEAL]: [
    "Your appeal challenge was submitted",
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

export interface AppealDetailProps {
  listingAddress: EthAddress;
  newsroom?: NewsroomWrapper;
  appeal: AppealData;
  challengeID: BigNumber;
  challenge: ChallengeData;
  challengeState: any;
  userAppealChallengeData?: UserChallengeData;
  parameters: any;
  govtParameters: any;
  tokenBalance: number;
  user: EthAddress;
  isMemberOfAppellate: boolean;
  txIdToConfirm?: number;
}

export interface AppealDetailProgressModalPropsState {
  isWaitingTransactionModalOpen?: boolean;
  isTransactionProgressModalOpen?: boolean;
  isTransactionSuccessModalOpen?: boolean;
  isTransactionRejectionModalOpen?: boolean;
  transactionType?: number;
  transactions?: any[];
  cancelTransaction?(): void;
}

class AppealDetail extends React.Component<AppealDetailProps, AppealDetailProgressModalPropsState> {
  constructor(props: AppealDetailProps) {
    super(props);

    this.state = {
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: false,
      isTransactionRejectionModalOpen: false,
      transactionType: undefined,
    };
  }

  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const { canAppealBeResolved, isAwaitingAppealChallenge } = this.props.challengeState;
    const hasAppealChallenge = appeal.appealChallenge;
    return (
      <StyledDiv>
        {!hasAppealChallenge &&
          !canAppealBeResolved &&
          !appeal.appealChallenge &&
          !isAwaitingAppealChallenge &&
          this.renderAwaitingAppealDecision()}
        {isAwaitingAppealChallenge && this.renderChallengeAppealStage()}
        {appeal.appealChallenge &&
          !appeal.appealChallenge.resolved && (
            <AppealChallengeDetail
              listingAddress={this.props.listingAddress}
              newsroom={this.props.newsroom}
              challengeID={this.props.challengeID}
              challenge={this.props.challenge}
              appeal={this.props.appeal}
              appealChallengeID={appeal.appealChallengeID}
              appealChallenge={appeal.appealChallenge}
              userAppealChallengeData={this.props.userAppealChallengeData}
              parameters={this.props.parameters}
              govtParameters={this.props.govtParameters}
              tokenBalance={this.props.tokenBalance}
              user={this.props.user}
            />
          )}
        {canAppealBeResolved && !appeal.appealChallenge && this.renderCanResolve()}
        {this.renderAwaitingTransactionModal()}
        {this.renderTransactionProgressModal()}
        {this.renderTransactionSuccessModal()}
      </StyledDiv>
    );
  }

  private renderAwaitingAppealDecision(): JSX.Element {
    const appeal = this.props.appeal;
    const challenge = this.props.challenge;
    const requester = appeal.requester.toString();
    const appealFeePaid = getFormattedTokenBalance(appeal.appealFeePaid);
    const endTime = appeal.appealPhaseExpiry.toNumber();
    const phaseLength = this.props.govtParameters.judgeAppealLen;
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

    const { isAwaitingAppealJudgment } = this.props.challengeState;

    let transactions;
    if (isAwaitingAppealJudgment && this.props.isMemberOfAppellate) {
      if (this.props.txIdToConfirm) {
        transactions = [
          {
            transaction: async () => {
              this.setState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                transactionType: AppealDetailTransactionTypes.CONFIRM_APPEAL,
              });
              return this.confirmAppeal();
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
      } else {
        transactions = [
          {
            transaction: async () => {
              this.setState({
                isWaitingTransactionModalOpen: true,
                isTransactionProgressModalOpen: false,
                isTransactionSuccessModalOpen: false,
                transactionType: AppealDetailTransactionTypes.GRANT_APPEAL,
              });
              return this.grantAppeal();
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
      }
    }

    return (
      <>
        <AppealAwaitingDecisionCard
          endTime={endTime}
          phaseLength={phaseLength}
          challengeID={this.props.challengeID.toString()}
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          requester={requester}
          appealFeePaid={appealFeePaid}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          transactions={transactions}
          txIdToConfirm={this.props.txIdToConfirm}
        />
        {transactions && this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderCanResolve(): JSX.Element {
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: AppealDetailTransactionTypes.RESOLVE_APPEAL,
          });
          return this.resolveAppeal();
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
    const challenge = this.props.challenge;
    const appealGranted = this.props.appeal.appealGranted;
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
        <AppealResolveCard
          challengeID={this.props.challengeID.toString()}
          challenger={challenge!.challenger.toString()}
          rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
          stake={getFormattedTokenBalance(challenge!.stake)}
          totalVotes={getFormattedTokenBalance(totalVotes)}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          percentFor={percentFor.toString()}
          percentAgainst={percentAgainst.toString()}
          appealGranted={appealGranted}
          transactions={transactions}
        />
        {this.renderTransactionRejectionModal(transactions, this.cancelTransaction)}
      </>
    );
  }

  private renderChallengeAppealStage(): JSX.Element {
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
    const transactions = [
      {
        transaction: async () => {
          this.setState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: AppealDetailTransactionTypes.APPROVE_CHALLENGE_APPEAL,
          });
          return approveForChallengeGrantedAppeal();
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
            transactionType: AppealDetailTransactionTypes.CHALLENGE_APPEAL,
          });
          return this.challengeGrantedAppeal();
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

  private renderTransactionSuccessModal(): JSX.Element | null {
    if (!this.state.isTransactionSuccessModalOpen) {
      return null;
    }
    const successLabel = AppealDetailTransactionSuccessLabels[this.state.transactionType!];
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
    const transactionLabel = AppealDetailTransactionLabels[this.state.transactionType!];
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
    const transactionLabel = AppealDetailTransactionLabels[this.state.transactionType!];
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

    const denialMessage = AppealDetailTransactionRejectionLabels[this.state.transactionType!];

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

  private grantAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return grantAppeal(this.props.listingAddress);
  };

  private confirmAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return confirmAppeal(this.props.txIdToConfirm!);
  };

  private challengeGrantedAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return challengeGrantedAppeal(this.props.listingAddress);
  };
  private resolveAppeal = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}

export default AppealDetail;
