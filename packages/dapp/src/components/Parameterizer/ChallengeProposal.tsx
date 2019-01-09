import * as React from "react";
import { compose } from "redux";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  ChallengeProposal as ChallengeProposalComponent,
  ChallengeProposalProps as ChallengeProposalComponentProps,
  ModalContent,
  ModalUnorderedList,
  ModalListItem,
} from "@joincivil/components";

import { approveForProposalChallenge, challengeReparameterization } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

export interface ChallengeProposalProps extends ChallengeProposalComponentProps {
  challengeProposalID: number;
}

enum TransactionTypes {
  APPROVE_FOR_PROPOSAL_CHALLENGE = "APPROVE_FOR_PROPOSAL_CHALLENGE",
  CHALLENGE_PROPOSAL = "CHALLENGE_PROPOSAL",
}

const transactionLabels = {
  [TransactionTypes.APPROVE_FOR_PROPOSAL_CHALLENGE]: "Approve For Proposal Challenge",
  [TransactionTypes.CHALLENGE_PROPOSAL]: "Challenge Proposal",
};

const multiStepTransactionLabels = {
  [TransactionTypes.APPROVE_FOR_PROPOSAL_CHALLENGE]: "1 of 2",
  [TransactionTypes.CHALLENGE_PROPOSAL]: "2 of 2",
};

const transactionSuccessContent = {
  [TransactionTypes.APPROVE_FOR_PROPOSAL_CHALLENGE]: [undefined, undefined],
  [TransactionTypes.CHALLENGE_PROPOSAL]: [
    "Your proposal challenge was submitted!",
    <>
      <ModalContent />
    </>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.APPROVE_FOR_PROPOSAL_CHALLENGE]: [
    "There was a problem with your proposal challenge",
    "Before proposing a new value, you need to confirm the approval of your proposal challenge token deposit in your MetaMask wallet.",
  ],
  [TransactionTypes.CHALLENGE_PROPOSAL]: [
    "Your proposal challenge was not submitted",
    "To submit a proposal challenge, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.APPROVE_FOR_PROPOSAL_CHALLENGE]: [
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
  [TransactionTypes.CHALLENGE_PROPOSAL]: [
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

class ChallengeProposal extends React.Component<ChallengeProposalProps & InjectedTransactionStatusModalProps> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);
  }

  public render(): JSX.Element {
    const challengeProposalProps = {
      ...this.props,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onChallengeProposalSuccess,
    };

    return <ChallengeProposalComponent {...challengeProposalProps} />;
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
            transactionType: TransactionTypes.APPROVE_FOR_PROPOSAL_CHALLENGE,
          });
          return approveForProposalChallenge();
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
            transactionType: TransactionTypes.CHALLENGE_PROPOSAL,
          });
          return this.challengeProposal();
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

  private onChallengeProposalSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
    this.props.handleClose();
  };

  private challengeProposal = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return challengeReparameterization(this.props.challengeProposalID!.toString());
  };
}

export default compose<React.ComponentClass<ChallengeProposalProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeProposal);
