import * as React from "react";
import { compose } from "redux";
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
import { BigNumber } from "bignumber.js";

export interface ListingEventProps {
  event: any;
  listing: string;
}

const challengeCompletedEventContainer = (WrappedComponent: React.StatelessComponent<ChallengeCompletedEventProps>) => {
  return compose<React.ComponentClass<ListingHistoryEventTimestampProps & ChallengeContainerProps>>(
    connectChallengeResults,
  )(WrappedComponent);
};

class ListingEvent extends React.Component<ListingEventProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const wrappedEvent = this.props.event;

    switch (wrappedEvent.event) {
      case "_Application":
        return this.renderApplicationEvent(wrappedEvent);

      case "_ApplicationWhitelisted":
        return <WhitelistedEvent timestamp={wrappedEvent.timestamp} />;

      case "_ListingRemoved":
        return <RejectedEvent timestamp={wrappedEvent.timestamp} />;

      case "_Challenge":
        return this.renderChallengeEvent(wrappedEvent);

      case "_ChallengeFailed":
        return this.renderChallengeFailedEvent(wrappedEvent);

      case "_ChallengeSucceeded":
        return this.renderChallengeSucceededEvent(wrappedEvent);

      default:
        return this.renderUnsupportedEvent(wrappedEvent);
    }
  }

  private renderApplicationEvent(wrappedEvent: any): JSX.Element {
    const { deposit } = wrappedEvent.args;
    const bnDeposit = new BigNumber(deposit);
    const formattedDeposit = getFormattedTokenBalance(bnDeposit);
    return <ApplicationEvent timestamp={(wrappedEvent as any).timestamp} deposit={formattedDeposit} />;
  }

  private renderChallengeEvent(wrappedEvent: any): JSX.Element {
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

  private renderChallengeFailedEvent(wrappedEvent: any): JSX.Element {
    const { challengeID } = wrappedEvent.args;
    const ChallengeFailedComponent = challengeCompletedEventContainer(
      ChallengeFailedEventComponent,
    ) as React.ComponentClass<ListingHistoryEventTimestampProps & ChallengeContainerProps>;

    return <ChallengeFailedComponent timestamp={wrappedEvent.timestamp} challengeID={challengeID} />;
  }

  private renderChallengeSucceededEvent(wrappedEvent: any): JSX.Element {
    const { challengeID } = wrappedEvent.args;
    const ChallengeSucceededComponent = challengeCompletedEventContainer(ChallengeSucceededEventComponent);

    return <ChallengeSucceededComponent timestamp={wrappedEvent.timestamp} challengeID={challengeID} />;
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
