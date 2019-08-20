import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, ListingHistoryEventStyles } from "./ListingHistoryEvent";

export const WhitelistedEvent: React.FunctionComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent
      title={ListingEventTitles.WHITELISTED}
      timestamp={props.timestamp}
      eventStyle={ListingHistoryEventStyles.WHITELISTED}
    />
  );
};
