import * as React from "react";
import { compose } from "redux";
import { formatRoute } from "react-router-named-routes";
import {
  AppealDecisionCard as AppealDecisionCardComponent,
  ListingDetailPhaseCardComponentProps,
  PhaseWithExpiryProps,
  ChallengePhaseProps,
  AppealDecisionProps,
} from "@joincivil/components";
import { urlConstants as links } from "@joincivil/utils";

import { routes } from "../../constants";
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
>(
  connectChallengeResults,
  connectChallengePhase,
)(AppealDecisionCardComponent);

class AppealSubmitChallenge extends React.Component<AppealDetailProps> {
  public render(): JSX.Element {
    const appeal = this.props.appeal;
    const appealGranted = appeal.appealGranted;
    const endTime = appeal.appealOpenToChallengeExpiry.toNumber();
    const phaseLength = this.props.parameters.challengeAppealLen;
    const appealGrantedStatementURI = appeal.appealGrantedStatementURI;

    const submitAppealChallengeURI = formatRoute(routes.SUBMIT_APPEAL_CHALLENGE, {
      listingAddress: this.props.listingAddress,
    });

    return (
      <AppealDecisionCard
        endTime={endTime}
        phaseLength={phaseLength}
        challengeID={this.props.challengeID.toString()}
        appealGrantedStatementURI={appealGrantedStatementURI}
        appealGranted={appealGranted}
        submitAppealChallengeURI={submitAppealChallengeURI}
        faqURL={links.FAQ_COMMUNITY_VETTING_PROCESS}
        onMobileTransactionClick={this.props.onMobileTransactionClick}
      />
    );
  }
}

export default AppealSubmitChallenge;
