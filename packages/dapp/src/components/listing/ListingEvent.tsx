import * as React from "react";
import styled from "styled-components";
import {
  CivilTCRLogEventsApplication,
  CivilTCRArgsApplication,
  CivilTCRArgsNewListingWhitelisted,
  CivilTCRLogEventsNewListingWhitelisted,
  CivilTCREvents,
} from "@joincivil/core";

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
`;

export interface ListingEventProps {
  event: any;
}

class ListingEvent extends React.Component<ListingEventProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const wrappedEvent = this.props.event as CivilTCRLogEventsApplication | CivilTCRLogEventsNewListingWhitelisted;
    let argsData: JSX.Element | null = null;
    switch (wrappedEvent.event) {
      case CivilTCREvents.Application:
        argsData = this.renderApplicationEvent(wrappedEvent.args);
        break;
      case CivilTCREvents.NewListingWhitelisted:
        argsData = this.renderNewListingWhitelistedEvent(wrappedEvent.args as CivilTCRArgsNewListingWhitelisted);
        break;
      default:
        argsData = this.renderUnsupportedEvent(wrappedEvent);
    }

    return (
      <StyledDiv>
        {new Date((wrappedEvent as any).timestamp * 1000).toUTCString()} - {argsData}
      </StyledDiv>
    );
  }

  private renderUnsupportedEvent(event: any): JSX.Element {
    return <>{event.event}</>;
  }

  private renderApplicationEvent(args: CivilTCRArgsApplication): JSX.Element {
    return <>Application --- Deposit: {args.deposit.toString()}</>;
  }
  private renderNewListingWhitelistedEvent(args: CivilTCRArgsNewListingWhitelisted): JSX.Element {
    return <>Whitelisted!</>;
  }
}

export default ListingEvent;
