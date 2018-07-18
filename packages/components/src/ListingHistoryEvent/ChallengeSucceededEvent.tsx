import * as React from "react";
import { ChallengeResults } from "../ListingDetailPhaseCard/ChallengeResults";
import { ChallengeCompletedEventProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

export const ChallengeSucceededEvent: React.StatelessComponent<ChallengeCompletedEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.CHALLENGE_SUCCEEDED} timestamp={props.timestamp}>
      <ChallengeResults
        totalVotes={props.totalVotes}
        votesFor={props.votesFor}
        votesAgainst={props.votesAgainst}
        percentFor={props.percentFor}
        percentAgainst={props.percentAgainst}
      />
    </ListingHistoryEvent>
  );
};
