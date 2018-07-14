import * as React from "react";
import { Link } from "react-router-dom";
import { CivilTCR } from "@joincivil/core";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export interface ChallengeEventProps extends ListingHistoryEventTimestampProps, CivilTCR.Args._Challenge {
  challengeURI: string;
}

export const ChallengeEvent: React.StatelessComponent<ChallengeEventProps> = props => {
  return (
    <ListingHistoryEvent title="Challenge Submitted" timestamp={props.timestamp}>
      <StyledEventCopy>
        by <strong>{props.challenger}</strong>
      </StyledEventCopy>
      <Link to={props.challengeURI}>View Historical Challenge - Challenge ID: {props.challengeID.toString()}</Link>
    </ListingHistoryEvent>
  );
};
