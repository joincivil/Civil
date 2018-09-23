import * as React from "react";
import { ChallengeResults } from "../ChallengeResultsChart";
import { ChallengeCompletedEventProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

export const ChallengeFailedEvent: React.StatelessComponent<ChallengeCompletedEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.CHALLENGE_FAILED} timestamp={props.timestamp}>
      <ChallengeResults
        headerText="Newsroom remains in registry"
        totalVotes={props.totalVotes}
        votesFor={props.votesFor}
        votesAgainst={props.votesAgainst}
        percentFor={props.percentFor}
        percentAgainst={props.percentAgainst}
      />
    </ListingHistoryEvent>
  );
};
