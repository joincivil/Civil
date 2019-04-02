import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export interface WithdrawalEventProps extends ListingHistoryEventTimestampProps {
  deposit: string;
}

export const WithdrawalEvent: React.FunctionComponent<WithdrawalEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.WITHDRAWAL} timestamp={props.timestamp}>
      <StyledEventCopy>
        <strong>{props.deposit}</strong> withdrawn
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
