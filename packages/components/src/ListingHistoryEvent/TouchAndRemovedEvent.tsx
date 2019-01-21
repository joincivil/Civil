import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export const TouchAndRemovedEvent: React.StatelessComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.TOUCH_AND_REMOVED} timestamp={props.timestamp}>
      <StyledEventCopy>Listing removed from registry because its deposit was too low</StyledEventCopy>
    </ListingHistoryEvent>
  );
};
