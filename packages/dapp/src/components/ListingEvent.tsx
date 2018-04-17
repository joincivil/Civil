import * as React from "react";
import styled from "styled-components";
import { ApplicationArgs } from "@joincivil/core";

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
    switch (wrappedEvent.decodedLogEntryEvent.event) {
      case "Application":
        argsData = this.renderApplicationEvent(wrappedEvent.decodedLogEntryEvent.args as ApplicationArgs);
        break;
    }

    return (
      <StyledDiv>
        {new Date(wrappedEvent.timestamp.toNumber() * 1000).toUTCString()} - {argsData}
      </StyledDiv>
    );
  }

  private renderApplicationEvent(args: ApplicationArgs): JSX.Element {
    return <>Application --- Deposit: {args.deposit.toString()}</>;
  }
}

export default ListingEvent;
