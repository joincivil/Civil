import * as React from "react";
import { compose } from "redux";

import { TwoStepEthTransaction, TxHash } from "@joincivil/core";
import {
  ResolveChallengeProposal as ResolveChallengeProposalComponent,
  ResolveChallengeProposalProps as ResolveChallengeProposalComponentProps,
  ChallengeResultsProps,
  ModalContent,
} from "@joincivil/components";

import { resolveReparameterizationChallenge } from "../../apis/civilTCR";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";

export interface ChallegeProposalResolveProps extends ResolveChallengeProposalComponentProps, ChallengeResultsProps {
  propID: number;
  parameterDisplayName: string | JSX.Element;
  parameterCurrentValue: string;
  parameterNewValue: string;
  handleClose(): void;
}

enum TransactionTypes {
  RESOLVE_CHALLENGE = "RESOLVE_CHALLENGE",
}

const transactionLabels = {
  [TransactionTypes.RESOLVE_CHALLENGE]: "Resolve Challenge",
};

const transactionSuccessContent = {
  [TransactionTypes.RESOLVE_CHALLENGE]: [
    "Thanks for resolving this challenge.",
    <ModalContent>
      Voters can now collect rewards from their votes on this challenge, if they are available.
    </ModalContent>,
  ],
};

const transactionRejectionContent = {
  [TransactionTypes.RESOLVE_CHALLENGE]: [
    "The challenge was not resolved",
    "To resolve the challenge, you need to confirm the transaction in your MetaMask wallet.",
  ],
};

const transactionErrorContent = {
  [TransactionTypes.RESOLVE_CHALLENGE]: [
    "The was an problem with resolving this challenge",
    <ModalContent>Please retry your transaction</ModalContent>,
  ],
};

const transactionStatusModalConfig = {
  transactionLabels,
  transactionSuccessContent,
  transactionRejectionContent,
  transactionErrorContent,
};

class ChallengeProposalResolve extends React.Component<
  ChallegeProposalResolveProps & InjectedTransactionStatusModalProps
> {
  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
    this.props.setHandleTransactionSuccessButtonClick(this.props.handleClose);
  }

  public render(): JSX.Element {
    const createProposalProps = {
      ...this.props,
      transactions: this.getTransactions(),
      postExecuteTransactions: this.onChallengeProposalResolveSuccess,
    };

    return <ResolveChallengeProposalComponent {...createProposalProps} />;
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
            transactionType: TransactionTypes.RESOLVE_CHALLENGE,
          });
          return this.resolveChallenge();
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

  private onChallengeProposalResolveSuccess = (): void => {
    this.props.updateTransactionStatusModalsState({
      isWaitingTransactionModalOpen: false,
      isTransactionProgressModalOpen: false,
      isTransactionSuccessModalOpen: true,
    });
    this.props.handleClose();
  };

  private resolveChallenge = async (): Promise<TwoStepEthTransaction<any> | void> => {
    return resolveReparameterizationChallenge(this.props.propID!.toString());
  };
}

export default compose<React.ComponentClass<ChallegeProposalResolveProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeProposalResolve);
