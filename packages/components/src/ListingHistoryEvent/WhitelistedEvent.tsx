import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingHistoryEvent, ListingHistoryEventStyles } from "./ListingHistoryEvent";

export const WhitelistedEvent: React.StatelessComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent
      title="Newsroom whitelisted on Civil Registry"
      timestamp={props.timestamp}
      eventStyle={ListingHistoryEventStyles.WHITELISTED}
    />
  );
};
