import * as React from "react";
import { buttonSizes, InvertedButton } from "../Button";
import { ListingSummaryComponentProps } from "./types";
import {
  ConfirmVoteNowButtonText,
  RequestAppealNowButtonText,
  SubmitAppealChallengeNowButtonText,
  UpdateStatusButtonText,
  ViewDetailsButtonText,
  VoteNowButtonText,
} from "./textComponents";

const SummaryActionButton: React.SFC<ListingSummaryComponentProps> = props => {
  return (
    <InvertedButton size={buttonSizes.SMALL} to={props.listingDetailURL}>
      <ButtonText {...props} />
    </InvertedButton>
  );
};

const ButtonText: React.SFC<ListingSummaryComponentProps> = props => {
  if (props.inChallengeCommitVotePhase || props.isInAppealChallengeCommitPhase) {
    return <VoteNowButtonText />;
  } else if (props.inChallengeRevealPhase || props.isInAppealChallengeRevealPhase) {
    return <ConfirmVoteNowButtonText />;
  } else if (props.isAwaitingAppealRequest) {
    return <RequestAppealNowButtonText />;
  } else if (props.isAwaitingAppealChallenge) {
    return <SubmitAppealChallengeNowButtonText />;
  } else if (
    props.canBeWhitelisted ||
    props.canResolveChallenge ||
    props.canResolveAppealChallenge ||
    props.canListingAppealBeResolved ||
    props.canListingAppealChallengeBeResolved
  ) {
    return <UpdateStatusButtonText />;
  }

  return <ViewDetailsButtonText />;
};

export default SummaryActionButton;
