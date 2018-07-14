import * as React from "react";
import { CivilTCR } from "@joincivil/core";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export const ApplicationEvent: React.StatelessComponent<
  ListingHistoryEventTimestampProps & CivilTCR.Args._Application
> = props => {
  const deposit = getFormattedTokenBalance(props.deposit);
  return (
    <ListingHistoryEvent title="Application Submitted" timestamp={props.timestamp}>
      <StyledEventCopy>
        <strong>{deposit}</strong> deposited
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
