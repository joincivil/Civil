import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingHistoryEvent, ListingHistoryEventStyles } from "./ListingHistoryEvent";

export const RejectedEvent: React.StatelessComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent
      title="Newsroom rejected from Civil Registry"
      timestamp={props.timestamp}
      eventStyle={ListingHistoryEventStyles.REJECTED}
    />
  );
};
