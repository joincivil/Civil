import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export interface DepositEventProps extends ListingHistoryEventTimestampProps {
  deposit: string;
}

export const DepositEvent: React.FunctionComponent<DepositEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.DEPOSIT} timestamp={props.timestamp}>
      <StyledEventCopy>
        <strong>{props.deposit}</strong> deposited
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
