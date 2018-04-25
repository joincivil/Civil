import * as React from "react";
import styled from "styled-components";
import { ApplicationArgs, NewListingWhitelistedArgs } from "@joincivil/core";

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
    const wrappedEvent = this.props.event;
    let argsData: JSX.Element | null = null;
    switch (wrappedEvent.event) {
      case "Application":
        argsData = this.renderApplicationEvent(wrappedEvent.args as ApplicationArgs);
        break;
      case "NewListingWhitelisted":
        argsData = this.renderNewListingWhitelistedEvent(wrappedEvent.args as NewListingWhitelistedArgs);
        break;
      default:
        argsData = this.renderUnsupportedEvent(wrappedEvent);
    }

    return (
      <StyledDiv>
        {new Date(wrappedEvent.timestamp * 1000).toUTCString()} - {argsData}
      </StyledDiv>
    );
  }

  private renderUnsupportedEvent(event: any): JSX.Element {
    return <>{event.event}</>;
  }

  private renderApplicationEvent(args: ApplicationArgs): JSX.Element {
    return <>Application --- Deposit: {args.deposit.toString()}</>;
  }
  private renderNewListingWhitelistedEvent(args: NewListingWhitelistedArgs): JSX.Element {
    return <>Whitelisted!</>;
  }
}

export default ListingEvent;
