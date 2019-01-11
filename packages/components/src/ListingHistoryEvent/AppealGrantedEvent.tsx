import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export const AppealGrantedEvent: React.StatelessComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.APPEAL_GRANTED} timestamp={props.timestamp}>
      <StyledEventCopy>
        The Council has Granted the requested appeal, reversing the outcome of the original challenge, although the
        community may still challenge this decision to overturn it.
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
