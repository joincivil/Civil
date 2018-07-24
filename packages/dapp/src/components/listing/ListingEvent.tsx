import * as React from "react";
import { compose } from "redux";
import { CivilTCR } from "@joincivil/core";
import {
  ApplicationEvent,
  ChallengeEvent,
  ChallengeCompletedEventProps,
  ChallengeFailedEvent as ChallengeFailedEventComponent,
  ChallengeSucceededEvent as ChallengeSucceededEventComponent,
  ListingHistoryEvent as ListingHistoryEventComponent,
  ListingHistoryEventTimestampProps,
  RejectedEvent,
  WhitelistedEvent,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { ChallengeContainerProps, connectChallengeResults } from "../utility/HigherOrderComponents";

export interface ListingEventProps {
  event: any;
  listing: string;
}

const challengeCompletedEventContainer = (WrappedComponent: React.StatelessComponent<ChallengeCompletedEventProps>) => {
  const wrappedChallengeResults = (props: ChallengeCompletedEventProps) => {
    return <WrappedComponent {...props} />;
  };

  return compose(connectChallengeResults)(wrappedChallengeResults) as React.ComponentClass<
    ListingHistoryEventTimestampProps & ChallengeContainerProps
  >;
};

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
        return this.renderApplicationEvent(wrappedEvent);

      case CivilTCR.Events._ApplicationWhitelisted:
        return <WhitelistedEvent timestamp={(wrappedEvent as any).timestamp} />;

      case CivilTCR.Events._ListingRemoved:
        return <RejectedEvent timestamp={(wrappedEvent as any).timestamp} />;

      case CivilTCR.Events._Challenge:
        return this.renderChallengeEvent(wrappedEvent);

      case CivilTCR.Events._ChallengeFailed:
        return this.renderChallengeFailedEvent(wrappedEvent);

      case CivilTCR.Events._ChallengeSucceeded:
        return this.renderChallengeSucceededEvent(wrappedEvent);

      default:
        return this.renderUnsupportedEvent(wrappedEvent);
    }
  }

  private renderApplicationEvent(wrappedEvent: CivilTCR.LogEvents._Application): JSX.Element {
    const { deposit } = wrappedEvent.args;
    const formattedDeposit = getFormattedTokenBalance(deposit);
    return <ApplicationEvent timestamp={(wrappedEvent as any).timestamp} deposit={formattedDeposit} />;
  }

  private renderChallengeEvent(wrappedEvent: CivilTCR.LogEvents._Challenge): JSX.Element {
    const { challengeID, challenger } = wrappedEvent.args;
    const challengeURI = `/listing/${this.props.listing}/challenge/${challengeID.toString()}`;
    return (
      <ChallengeEvent
        timestamp={(wrappedEvent as any).timestamp}
        challengeURI={challengeURI}
        challenger={challenger}
        challengeID={challengeID.toString()}
      />
    );
  }

  private renderChallengeFailedEvent(wrappedEvent: CivilTCR.LogEvents._ChallengeFailed): JSX.Element {
    const { challengeID } = wrappedEvent.args;
    const ChallengeFailedComponent = challengeCompletedEventContainer(ChallengeFailedEventComponent);

    return <ChallengeFailedComponent timestamp={(wrappedEvent as any).timestamp} challengeID={challengeID} />;
  }

  private renderChallengeSucceededEvent(wrappedEvent: CivilTCR.LogEvents._ChallengeSucceeded): JSX.Element {
    const { challengeID } = wrappedEvent.args;
    const ChallengeSucceededComponent = challengeCompletedEventContainer(ChallengeSucceededEventComponent);

    return <ChallengeSucceededComponent timestamp={(wrappedEvent as any).timestamp} challengeID={challengeID} />;
  }

  private renderUnsupportedEvent(wrappedEvent: any): JSX.Element {
    const props = {
      timestamp: wrappedEvent.timestamp,
      title: wrappedEvent.event,
    };

    return <ListingHistoryEventComponent {...props} />;
  }
}

export default ListingEvent;
