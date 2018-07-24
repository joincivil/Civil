import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export interface ApplicationEventProps extends ListingHistoryEventTimestampProps {
  deposit: string;
}

export const ApplicationEvent: React.StatelessComponent<ApplicationEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.APPLICATION} timestamp={props.timestamp}>
      <StyledEventCopy>
        <strong>{props.deposit}</strong> deposited
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
