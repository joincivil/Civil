import * as React from "react";
import { ChallengeResults } from "../ChallengeResultsChart";
import { ChallengeCompletedEventProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

export const ChallengeSucceededEvent: React.StatelessComponent<ChallengeCompletedEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.CHALLENGE_SUCCEEDED} timestamp={props.timestamp}>
      <ChallengeResults
        headerText="Newsroom removed from registry"
        totalVotes={props.totalVotes}
        votesFor={props.votesFor}
        votesAgainst={props.votesAgainst}
        percentFor={props.percentFor}
        percentAgainst={props.percentAgainst}
        didChallengeSucceed={props.didChallengeSucceed}
      />
    </ListingHistoryEvent>
  );
};
