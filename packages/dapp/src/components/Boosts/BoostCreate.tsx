import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { compose, withApollo, WithApolloClient } from "react-apollo";
import { Helmet } from "react-helmet";
import gql from "graphql-tag";
import { Set } from "immutable";

import { NewsroomState } from "@joincivil/newsroom-signup";
import { CharterData, EthAddress } from "@joincivil/core";
import { BoostForm } from "@joincivil/civil-sdk";
import { FeatureFlag } from "@joincivil/components";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import LoadingMsg from "../utility/LoadingMsg";
import ErrorLoadingDataMsg from "../utility/ErrorLoadingData";
import { addUserNewsroom, getContent } from "../../redux/actionCreators/newsrooms";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { ComingSoonText } from "./BoostStyledComponents";

const NEWSROOMS_QUERY = gql`
  query {
    nrsignupNewsroom {
      newsroomAddress
    }
  }
`;

export interface BoostCreatePageProps {
  currentUserNewsrooms: Set<string>;
  useGraphQL: boolean;
  newsroom?: NewsroomState;
  charter?: CharterData;
}

export interface BoostCreatePageState {
  newsroomAddress?: EthAddress;
  gqlLoading?: boolean;
  gqlError?: any;
}

class BoostCreatePage extends React.Component<
  WithApolloClient<BoostCreatePageProps & DispatchProp<any>>,
  BoostCreatePageState
> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  public async componentDidUpdate(): Promise<void> {
    await this.fetchNewsroomData();
  }

  public async componentDidMount(): Promise<void> {
    await this.fetchNewsroomAddress();
    await this.fetchNewsroomData();
  }

  public render(): JSX.Element {
    return (
      <>
        <Helmet title="Launch Boost - The Civil Registry" />
        <ScrollToTopOnMount />
        <FeatureFlag feature={"boosts-mvp"} replacement={<ComingSoonText />}>
          {this.renderCreateBoost()}
        </FeatureFlag>
      </>
    );
  }

  private renderCreateBoost(): JSX.Element {
    if (this.state.gqlLoading || !this.props.newsroom || !this.props.charter) {
      return <LoadingMsg />;
    }
    if (this.state.gqlError) {
      return <ErrorLoadingDataMsg />;
    }

    const { newsroom, charter } = this.props;
    const listingRoute = formatRoute(routes.LISTING, { listingAddress: newsroom.address });
    return (
      <BoostForm
        newsroomAddress={newsroom.address}
        newsroomName={charter.name}
        newsroomListingUrl={`${document.location.origin}${listingRoute}`}
        newsroomWallet={newsroom.wrapper.data.owners[0]}
        newsroomUrl={charter && charter.newsroomUrl}
        newsroomTagline={charter && charter.tagline}
        newsroomLogoUrl={charter && charter.logoUrl}
      />
    );
  }

  private async fetchNewsroomAddress(): Promise<void> {
    if (this.props.useGraphQL && this.props.currentUserNewsrooms.isEmpty()) {
      this.setState({
        gqlLoading: true,
      });
      try {
        const result = (await this.props.client.query({
          query: NEWSROOMS_QUERY,
        })) as any;
        if (!result || !result.data || !result.data.nrsignupNewsroom || !result.data.nrsignupNewsroom.newsroomAddress) {
          // @TODO/tobek No newsroom: tell user to make one
        }
        this.setState({
          gqlLoading: false,
          newsroomAddress: result.data.nrsignupNewsroom.newsroomAddress,
        });
        this.props.dispatch!(addUserNewsroom(result.data.nrsignupNewsroom.newsroomAddress));
      } catch (e) {
        this.setState({
          gqlError: e,
        });
      }
    }
  }

  private async fetchNewsroomData(): Promise<void> {
    if (!this.props.newsroom && this.props.currentUserNewsrooms.first()) {
      this.props.dispatch!(fetchAndAddListingData(this.props.currentUserNewsrooms.first()));
    }
    if (this.props.newsroom && !this.props.charter) {
      this.props.dispatch!(await getContent(this.props.newsroom.wrapper.data.charterHeader!));
    }
  }
}

const mapStateToProps = (state: State, ownProps: BoostCreatePageProps): BoostCreatePageProps => {
  const { currentUserNewsrooms, content } = state.networkDependent;
  const { useGraphQL, newsrooms } = state;
  const newsroom = currentUserNewsrooms.first() ? newsrooms.get(currentUserNewsrooms.first()) : undefined;
  let charter;
  if (newsroom && newsroom.wrapper.data.charterHeader) {
    charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
  }

  // @TODO/tobek Also load listing data so we can check if newsroom is whitelisted
  return {
    ...ownProps,
    useGraphQL,
    currentUserNewsrooms,
    newsroom,
    charter,
  };
};

export default compose(withApollo, connect(mapStateToProps))(BoostCreatePage);
