import * as React from "react";
import { compose } from "redux";
import { EthAddress, TwoStepEthTransaction } from "@joincivil/core";
import {
  ListingDetailPhaseCardComponentProps,
  ChallengeResolveCard as ChallengeResolveCardComponent,
  LoadingIndicator,
  ModalHeading,
  ModalContent,
  ModalOrderedList,
  ModalListItem,
  ModalListItemTypes,
} from "@joincivil/components";

import { updateStatus } from "../../apis/civilTCR";
import {
  ChallengeContainerProps,
  connectChallengeResults,
  connectChallengePhase,
} from "../utility/HigherOrderComponents";

export interface ChallengeResolveProps extends ChallengeContainerProps {
  listingAddress: EthAddress;
}

enum ModalContentEventNames {
  IN_PROGRESS_RESOLVE_CHALLENGE = "IN_PROGRESS:RESOLVE_CHALLENGE",
}

const ChallengeResolveCard = compose(connectChallengePhase, connectChallengeResults)(
  ChallengeResolveCardComponent,
) as React.ComponentClass<ChallengeResolveProps & ListingDetailPhaseCardComponentProps>;

// A container for the Challenge Resolve Card component
export class ChallengeResolve extends React.Component<ChallengeResolveProps> {
  public render(): JSX.Element | null {
    const resolveChallengeProgressModal = this.renderResolveChallengeProgressModal();
    const modalContentComponents = {
      [ModalContentEventNames.IN_PROGRESS_RESOLVE_CHALLENGE]: resolveChallengeProgressModal,
    };
    const transactions = [
      { transaction: this.resolve, progressEventName: ModalContentEventNames.IN_PROGRESS_RESOLVE_CHALLENGE },
    ];

    return (
      <ChallengeResolveCard
        listingAddress={this.props.listingAddress}
        challengeID={this.props.challengeID}
        modalContentComponents={modalContentComponents}
        transactions={transactions}
      />
    );
  }

  private renderResolveChallengeProgressModal(): JSX.Element {
    return (
      <>
        <LoadingIndicator height={100} />
        <ModalHeading>Transaction in progress</ModalHeading>
        <ModalOrderedList>
          <ModalListItem type={ModalListItemTypes.STRONG}>Resolving Challenge</ModalListItem>
        </ModalOrderedList>
        <ModalContent>This can take 1-3 minutes. Please don't close the tab.</ModalContent>
        <ModalContent>How about taking a little breather and standing for a bit? Maybe even stretching?</ModalContent>
      </>
    );
  }

  private resolve = async (): Promise<TwoStepEthTransaction<any>> => {
    return updateStatus(this.props.listingAddress);
  };
}
