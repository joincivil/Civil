import * as React from "react";
import { compose } from "redux";
import { TwoStepEthTransaction } from "@joincivil/core";
import { EthAddress, TxHash } from "@joincivil/typescript-types";
import {
  ListingDetailPhaseCardComponentProps,
  ChallengeResolveCard as ChallengeResolveCardComponent,
  ModalContent,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { CivilHelper, CivilHelperContext } from "../../apis/CivilHelper";
import { InjectedTransactionStatusModalProps, hasTransactionStatusModals } from "../utility/TransactionStatusModalsHOC";
import {
  ChallengeContainerProps,
  connectChallengeResults,
  connectChallengePhase,
} from "../utility/HigherOrderComponents";

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

export interface ChallengeResolveProps extends ChallengeContainerProps {
  listingAddress: EthAddress;
  onMobileTransactionClick(): any;
}

const ChallengeResolveCard = compose(
  connectChallengePhase,
  connectChallengeResults,
)(ChallengeResolveCardComponent) as React.ComponentClass<ChallengeResolveProps & ListingDetailPhaseCardComponentProps>;

// A container for the Challenge Resolve Card component
class ChallengeResolve extends React.Component<ChallengeResolveProps & InjectedTransactionStatusModalProps> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public componentWillMount(): void {
    this.props.setTransactions(this.getTransactions());
  }

  public render(): JSX.Element | null {
    const transactions = this.getTransactions();

    return (
      <ChallengeResolveCard
        listingAddress={this.props.listingAddress}
        challengeID={this.props.challengeID}
        transactions={transactions}
        onMobileTransactionClick={this.props.onMobileTransactionClick}
        faqURL={links.FAQ_HOW_TO_UPDATE_NEWSROOM_STATUS}
      />
    );
  }

  private getTransactions = (): any[] => {
    return [
      {
        transaction: async () => {
          this.props.updateTransactionStatusModalsState({
            isWaitingTransactionModalOpen: true,
            isTransactionProgressModalOpen: false,
            isTransactionSuccessModalOpen: false,
            transactionType: TransactionTypes.RESOLVE_CHALLENGE,
          });
          return this.resolve();
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

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return this.context.updateStatus(this.props.listingAddress);
  };
}

export default compose<React.ComponentClass<ChallengeResolveProps>>(
  hasTransactionStatusModals(transactionStatusModalConfig),
)(ChallengeResolve);
