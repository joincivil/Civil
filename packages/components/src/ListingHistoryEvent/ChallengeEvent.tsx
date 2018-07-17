import * as React from "react";
import { Link } from "react-router-dom";
import { EthAddress } from "@joincivil/core";
import { ListingHistoryEventTimestampProps } from "./types";
import { ListingEventTitles } from "./constants";
import { ListingHistoryEvent, StyledEventCopy } from "./ListingHistoryEvent";

export interface ChallengeEventProps extends ListingHistoryEventTimestampProps {
  challengeID: string;
  challenger: EthAddress;
  challengeURI: string;
}

export const ChallengeEvent: React.StatelessComponent<ChallengeEventProps> = props => {
  return (
    <ListingHistoryEvent title={ListingEventTitles.CHALLENGE} timestamp={props.timestamp}>
      <StyledEventCopy>
        by <strong>{props.challenger}</strong>
      </StyledEventCopy>
      <Link to={props.challengeURI}>View Historical Challenge - Challenge ID: {props.challengeID}</Link>
    </ListingHistoryEvent>
  );
};
