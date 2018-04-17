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
`;

export interface ListingsState {
  applications: List<string>;
  applicationSubscription: Subscription;
  error: undefined | string;
}

class Listings extends React.Component<{}, ListingsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      applications: List<string>(),
      applicationSubscription: new Subscription(),
      error: undefined,
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
        applications: {this.state.applications.toString()}
        <br />
        {this.state.error}
      </StyledDiv>
    );
  }

  private initListings = async () => {
    const civil = new Civil();
    let tcr;
    try {
      tcr = civil.tcrSingletonTrusted();
    } catch (ex) {
      console.log("failed to get tcr.");
      this.setState({
        error: "No Supported Network Found. Please set MetaMask network to Rinkeby and Unlock Account.",
      });
    }

    if (tcr) {
      const subscription = tcr.listingsInApplicationStage().subscribe(listing => {
        this.setState({ applications: this.state.applications.push(listing) });
      });
      this.setState({ applicationSubscription: subscription });
    }
  };
}

export default Listings;
