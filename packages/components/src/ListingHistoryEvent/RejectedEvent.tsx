import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, ListingHistoryEventStyles } from "./ListingHistoryEvent";

export const RejectedEvent: React.FunctionComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent
      title={ListingEventTitles.REJECTED}
      timestamp={props.timestamp}
      eventStyle={ListingHistoryEventStyles.REJECTED}
    />
  );
};
