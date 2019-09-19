import * as React from "react";
import { compose } from "redux";
import { formatRoute } from "react-router-named-routes";
import {
  AppealGrantedEvent,
  AppealRequestedEvent,
  ApplicationEvent,
  ChallengeEvent,
  ChallengeCompletedEventProps,
  ChallengeFailedEvent as ChallengeFailedEventComponent,
  ChallengeSucceededEvent as ChallengeSucceededEventComponent,
  DepositEvent,
  GrantedAppealChallengedEvent,
  ListingHistoryEventTimestampProps,
  ListingWithdrawnEvent,
  RejectedEvent,
  TouchAndRemovedEvent,
  WhitelistedEvent,
  WithdrawalEvent,
} from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";

import { routes } from "../../constants";
import { ChallengeContainerProps, connectChallengeResults } from "../utility/HigherOrderComponents";

export interface ListingEventProps {
  event: any;
  listing: string;
}

const challengeCompletedEventContainer = (WrappedComponent: React.FunctionComponent<ChallengeCompletedEventProps>) => {
  return compose<React.ComponentClass<ListingHistoryEventTimestampProps & ChallengeContainerProps>>(
    connectChallengeResults,
  )(WrappedComponent);
};

class ListingEvent extends React.Component<ListingEventProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element | null {
    const wrappedEvent = this.props.event;

    switch (wrappedEvent.event) {
      case "_AppealGranted":
        return <AppealGrantedEvent timestamp={wrappedEvent.timestamp} />;

      case "_AppealRequested":
        return <AppealRequestedEvent timestamp={wrappedEvent.timestamp} />;

      case "_Application":
        return this.renderApplicationEvent(wrappedEvent);

      case "_ApplicationRemoved":
        return <RejectedEvent timestamp={wrappedEvent.timestamp} />;

      case "_ApplicationWhitelisted":
        return <WhitelistedEvent timestamp={wrappedEvent.timestamp} />;

      case "_Challenge":
        return this.renderChallengeEvent(wrappedEvent);

      case "_ChallengeFailed":
        return this.renderChallengeFailedEvent(wrappedEvent);

      case "_ChallengeSucceeded":
        return this.renderChallengeSucceededEvent(wrappedEvent);

      case "_FailedChallengeOverturned":
        return this.renderChallengeSucceededEvent(wrappedEvent);

      case "_SuccessfulChallengeOverturned":
        return this.renderChallengeFailedEvent(wrappedEvent);

      case "_Deposit":
        return this.renderDepositEvent(wrappedEvent);

      case "_GrantedAppealChallenged":
        return <GrantedAppealChallengedEvent timestamp={wrappedEvent.timestamp} />;

      case "_ListingRemoved":
        return <RejectedEvent timestamp={wrappedEvent.timestamp} />;

      case "_ListingWithdrawn":
        return <ListingWithdrawnEvent timestamp={wrappedEvent.timestamp} />;

      case "_TouchAndRemoved":
        return <TouchAndRemovedEvent timestamp={wrappedEvent.timestamp} />;

      case "_Withdrawal":
        return this.renderWithdrawalEvent(wrappedEvent);

      default:
        return null;
    }
  }

  private renderWithdrawalEvent(wrappedEvent: any): JSX.Element {
    const { withdrew } = wrappedEvent.args || wrappedEvent.returnValues;
    const formattedDeposit = getFormattedTokenBalance(withdrew);
    return <WithdrawalEvent timestamp={(wrappedEvent as any).timestamp} deposit={formattedDeposit} />;
  }

  private renderDepositEvent(wrappedEvent: any): JSX.Element {
    const { added } = wrappedEvent.args || wrappedEvent.returnValues;
    const formattedDeposit = getFormattedTokenBalance(added);
    return <DepositEvent timestamp={(wrappedEvent as any).timestamp} deposit={formattedDeposit} />;
  }

  private renderApplicationEvent(wrappedEvent: any): JSX.Element {
    const { deposit } = wrappedEvent.args || wrappedEvent.returnValues;
    const formattedDeposit = getFormattedTokenBalance(deposit);
    return <ApplicationEvent timestamp={(wrappedEvent as any).timestamp} deposit={formattedDeposit} />;
  }

  private renderChallengeEvent(wrappedEvent: any): JSX.Element {
    const { challengeID, challenger } = wrappedEvent.args || wrappedEvent.returnValues;
    const challengeURI = formatRoute(routes.CHALLENGE, {
      listingAddress: this.props.listing,
      challengeID: challengeID.toString(),
    });
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
    const { challengeID } = wrappedEvent.args || wrappedEvent.returnValues;
    const ChallengeFailedComponent = challengeCompletedEventContainer(
      ChallengeFailedEventComponent,
    ) as React.ComponentClass<ListingHistoryEventTimestampProps & ChallengeContainerProps>;

    return <ChallengeFailedComponent timestamp={wrappedEvent.timestamp} challengeID={challengeID} />;
  }

  private renderChallengeSucceededEvent(wrappedEvent: any): JSX.Element {
    const { challengeID } = wrappedEvent.args || wrappedEvent.returnValues;
    const ChallengeSucceededComponent = challengeCompletedEventContainer(ChallengeSucceededEventComponent);

    return <ChallengeSucceededComponent timestamp={wrappedEvent.timestamp} challengeID={challengeID} />;
  }
}

export default ListingEvent;
