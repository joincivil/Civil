import * as React from "react";
import { ChallengeResultsProps } from "../ListingDetailPhaseCard/types";
import { ChallengeResults } from "../ListingDetailPhaseCard/ChallengeResults";

import { ListingHistoryEventTimestampProps } from "./types";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

export interface ChallengeFailedEventProps extends ListingHistoryEventTimestampProps, ChallengeResultsProps {}

export const ChallengeFailedEvent: React.StatelessComponent<ChallengeFailedEventProps> = props => {
  return (
    <ListingHistoryEvent title="Challenge failed" timestamp={props.timestamp}>
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
