import * as React from "react";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export const GrantedAppealChallengedEvent: React.FunctionComponent<ListingHistoryEventTimestampProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.GRANTED_APPEAL_CHALLENGED} timestamp={props.timestamp}>
      <StyledEventCopy>
        A member of the community has challenged the Council's decision to grant the appeal. If the challenge succeeds,
        the appeal will be overturned and the original challenge outcome will stand.
      </StyledEventCopy>
    </ListingHistoryEvent>
  );
};
