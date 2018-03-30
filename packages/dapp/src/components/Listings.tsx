import * as React from "react";
import styled from "styled-components";
import { Civil } from "@joincivil/core";
import { List } from "immutable";
import { Subscription } from "rxjs";
const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%
  color: black;
  border-bottom: 2px solid black;
`;

export interface ListingsState {
  applications: List<string>;
  applicationSubscription: Subscription;
}

class Listings extends React.Component<{}, ListingsState> {

  constructor(props: any) {
    super(props);
    this.state = {
      applications: List<string>(),
      applicationSubscription: new Subscription(),
    };
  }

  public componentWillMount(): void {
    window.addEventListener("load", this.initListings);
  }

  public componentWillUnmount(): void {
    this.state.applicationSubscription.unsubscribe();
    window.removeEventListener("load", this.initListings);
  }

  public render(): JSX.Element {
    return (
      <StyledDiv>
        whaddup listings: {this.state.applications.toString()}
      </StyledDiv>
    );
  }

  private initListings = () => {

    const civil = new Civil();
    const tcr = civil.tcrSingletonTrusted();
    const instance = this;
    const subscription = tcr.listingsInApplicationStage().subscribe((listing) => {
      instance.setState({applications: this.state.applications.push(listing)});
    });
    this.setState({applicationSubscription : subscription});
  }
}

export default Listings;
