import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export const AppealRequestedEvent: React.FunctionComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.APPEAL_REQUESTED} timestamp={props.timestamp}>
      <StyledEventCopy>
        A user requested an appeal of the challenge results. The council will decide whether or not to grant the appeal
        after deliberating.
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
