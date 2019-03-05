import * as React from "react";
import { compose } from "redux";
import {
  AppealDecisionCard as AppealDecisionCardComponent,
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  AppealDecisionProps,
} from "@joincivil/components";

import { FAQ_BASE_URL } from "../../constants";
import {
  ChallengeContainerProps,
  connectChallengePhase,
  connectChallengeResults,
} from "../utility/HigherOrderComponents";

import { AppealDetailProps } from "./AppealDetail";

const AppealDecisionCard = compose<
  React.ComponentType<
    ListingDetailPhaseCardComponentProps &
      PhaseWithExpiryProps &
      ChallengePhaseProps &
      ChallengeContainerProps &
      AppealDecisionProps
  >
>(connectChallengeResults, connectChallengePhase)(AppealDecisionCardComponent);

class AppealSubmitChallenge extends React.Component<AppealDetailProps> {
  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const appealGranted = appeal.appealGranted;
    const endTime = appeal.appealOpenToChallengeExpiry.toNumber();
    const phaseLength = this.props.parameters.challengeAppealLen;

    const submitAppealChallengeURI = `/listing/${this.props.listingAddress}/submit-appeal-challenge`;

    return (
      <AppealDecisionCard
        endTime={endTime}
        phaseLength={phaseLength}
        challengeID={this.props.challengeID.toString()}
        appealGranted={appealGranted}
        submitAppealChallengeURI={submitAppealChallengeURI}
        faqURL={`${FAQ_BASE_URL}/hc/en-us/categories/360001542132-Registry`}
        onMobileTransactionClick={this.props.onMobileTransactionClick}
      />
    );
  }
}

export default AppealSubmitChallenge;
