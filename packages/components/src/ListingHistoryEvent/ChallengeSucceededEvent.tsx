import * as React from "react";
import { ChallengeResultsProps } from "../ListingDetailPhaseCard/types";
import { ChallengeResults } from "../ListingDetailPhaseCard/ChallengeResults";

import { ListingHistoryEventTimestampProps } from "./types";
import { ListingHistoryEvent } from "./ListingHistoryEvent";

export interface ChallengeSucceededEventProps extends ListingHistoryEventTimestampProps, ChallengeResultsProps {}

export const ChallengeSucceededEvent: React.StatelessComponent<ChallengeSucceededEventProps> = props => {
  return (
    <ListingHistoryEvent title="Challenge succeeded" timestamp={props.timestamp}>
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
