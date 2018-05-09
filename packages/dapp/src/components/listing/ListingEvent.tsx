import * as React from "react";
import styled from "styled-components";
import { CivilTCR } from "@joincivil/core";

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
    const wrappedEvent = this.props.event as CivilTCR.LogEvents.Application | CivilTCR.LogEvents.NewListingWhitelisted;
    let argsData: JSX.Element | null = null;
    console.log(wrappedEvent);
    switch (wrappedEvent.event) {
      case CivilTCR.Events.Application:
        argsData = this.renderApplicationEvent(wrappedEvent.args);
        break;
      case CivilTCR.Events.NewListingWhitelisted:
        argsData = this.renderNewListingWhitelistedEvent(wrappedEvent.args as CivilTCR.Args.NewListingWhitelisted);
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

  private renderApplicationEvent(args: CivilTCR.Args.Application): JSX.Element {
    return <>Application --- Deposit: {args.deposit.toString()}</>;
  }
  private renderNewListingWhitelistedEvent(args: CivilTCR.Args.NewListingWhitelisted): JSX.Element {
    return <>Whitelisted!</>;
  }
}

export default ListingEvent;
