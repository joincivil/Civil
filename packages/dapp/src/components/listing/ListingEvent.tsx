import * as React from "react";
import { CivilTCR } from "@joincivil/core";
import {
  ApplicationEvent,
  ChallengeEvent,
  ChallengeFailedEvent,
  ChallengeSucceededEvent,
  ListingHistoryEvent as ListingHistoryEventComponent,
  RejectedEvent,
  WhitelistedEvent,
} from "@joincivil/components";

export interface ListingEventProps {
  event: any;
  listing: string;
}

class ListingEvent extends React.Component<ListingEventProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const wrappedEvent = this.props.event as
      | CivilTCR.LogEvents._Application
      | CivilTCR.LogEvents._ApplicationWhitelisted
      | CivilTCR.LogEvents._Challenge
      | CivilTCR.LogEvents._ChallengeFailed
      | CivilTCR.LogEvents._ChallengeSucceeded
      | CivilTCR.LogEvents._ListingRemoved;

    switch (wrappedEvent.event) {
      case CivilTCR.Events._Application:
        return <ApplicationEvent timestamp={(wrappedEvent as any).timestamp} {...wrappedEvent.args} />;
      case CivilTCR.Events._ApplicationWhitelisted:
        return <WhitelistedEvent timestamp={(wrappedEvent as any).timestamp} />;
      case CivilTCR.Events._ListingRemoved:
        return <RejectedEvent timestamp={(wrappedEvent as any).timestamp} />;
      case CivilTCR.Events._Challenge:
        const challengeURI = `/listing/${this.props.listing}/challenge/${wrappedEvent.args.challengeID.toString()}`;
        return (
          <ChallengeEvent
            timestamp={(wrappedEvent as any).timestamp}
            challengeURI={challengeURI}
            {...wrappedEvent.args}
          />
        );
      case CivilTCR.Events._ChallengeFailed:
        // TODO(jon): Look up challenge by challenge ID and pass results to results component
        return (
          <ChallengeFailedEvent
            timestamp={(wrappedEvent as any).timestamp}
            totalVotes="100"
            votesFor="20"
            votesAgainst="80"
            percentFor="20"
            percentAgainst="80"
          />
        );
      case CivilTCR.Events._ChallengeSucceeded:
        // TODO(jon): Look up challenge by challenge ID and pass results to results component
        return (
          <ChallengeSucceededEvent
            timestamp={(wrappedEvent as any).timestamp}
            totalVotes="100"
            votesFor="80"
            votesAgainst="20"
            percentFor="80"
            percentAgainst="20"
          />
        );
      default:
        const props = {
          timestamp: (wrappedEvent as any).timestamp,
          title: (wrappedEvent as any).event,
        };

        return <ListingHistoryEventComponent {...props} />;
    }
  }
}

export default ListingEvent;
