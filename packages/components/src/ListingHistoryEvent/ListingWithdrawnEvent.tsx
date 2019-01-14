import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export const ListingWithdrawnEvent: React.StatelessComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.LISTING_WITHDRAWN} timestamp={props.timestamp}>
      <StyledEventCopy>Listing withdrawn from registry</StyledEventCopy>
    </ListingHistoryEvent>
  );
};
