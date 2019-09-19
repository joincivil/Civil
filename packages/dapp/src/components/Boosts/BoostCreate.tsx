import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Link } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import { compose, withApollo, WithApolloClient, Query } from "react-apollo";
import { Helmet } from "react-helmet";
import gql from "graphql-tag";
import { Set } from "immutable";
import styled from "styled-components";

import { NewsroomState } from "@joincivil/newsroom-signup";
import { CharterData, EthAddress } from "@joincivil/core";
import { BoostForm } from "@joincivil/sdk";
import { FeatureFlag, AuthenticatedRoute, ErrorLoadingData, LoadingMessage } from "@joincivil/components";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { addUserNewsroom, getContent } from "../../redux/actionCreators/newsrooms";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { ComingSoonText } from "./BoostStyledComponents";
import { StyledInPageMsgContainer } from "../utility/styledComponents";
import {
  newsroomChannelAdminQuery,
  newsroomChannelsFromQueryData,
} from "../Dashboard/ManageNewsroom/WithNewsroomChannelAdminList";
import { CivilHelperContext, CivilHelper } from "../../apis/CivilHelper";

const NoNewsroomMessage = styled.div`
  font-size: 16px;
  margin: 0 auto;
  max-width: 640px;
  padding: 20px;
`;

const CHANNEL_ID_FROM_NEWSROOM_ADDRESS_QUERY = gql`
  query($contractAddress: String!) {
    channelsGetByNewsroomAddress(contractAddress: $contractAddress) {
      id
    }
  }
`;

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
  multipleNewsrooms?: boolean;
}

class BoostCreatePage extends React.Component<
  WithApolloClient<BoostCreatePageProps & DispatchProp<any>>,
  BoostCreatePageState
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

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
    if (!this.state.gqlLoading && !this.state.newsroomAddress) {
      return (
        <StyledInPageMsgContainer>
          <NoNewsroomMessage>
            You have not yet created a newsroom. Please{" "}
            <Link to={routes.APPLY_TO_REGISTRY}>create your newsroom application</Link> and then, once you have applied
            to the registry and your newsroom has been approved, you can return to create a Boost.
          </NoNewsroomMessage>
        </StyledInPageMsgContainer>
      );
    } else if (this.state.gqlError) {
      // useGraphQL flase to suppress "turn off graphql" message because that won't fix it here
      return (
        <StyledInPageMsgContainer>
          <ErrorLoadingData useGraphQL={false} />
        </StyledInPageMsgContainer>
      );
    } else if (this.state.gqlLoading || !this.props.newsroom || !this.props.charter) {
      return <LoadingMessage />;
    } else if (this.state.multipleNewsrooms) {
      return (
        <StyledInPageMsgContainer>
          <p>
            You have multiple newsrooms connected to your account. Please go to{" "}
            <Link to={formatRoute(routes.DASHBOARD, { activeDashboardTab: "newsrooms" })}>
              your newsrooms dashboard
            </Link>{" "}
            to select a specific newsroom and launch a boost from there.
          </p>
        </StyledInPageMsgContainer>
      );
    }

    const { newsroom, charter } = this.props;
    const listingRoute = formatRoute(routes.LISTING, { listingAddress: newsroom.address });
    return (
      <Query query={CHANNEL_ID_FROM_NEWSROOM_ADDRESS_QUERY} variables={{ contractAddress: newsroom.address }}>
        {({ loading, error, data }) => {
          if (loading || error) {
            return <></>;
          }
          return (
            <BoostForm
              channelID={data.channelsGetByNewsroomAddress.id}
              newsroomData={{
                name: charter.name,
                url: charter && charter.newsroomUrl,
                owner: newsroom.multisigAddress,
              }}
              newsroomContractAddress={newsroom.address}
              newsroomListingUrl={`${document.location.origin}${listingRoute}`}
              newsroomTagline={charter && charter.tagline}
              newsroomLogoUrl={charter && charter.logoUrl}
            />
          );
        }}
      </Query>
    );
  }

  private async fetchNewsroomAddress(): Promise<void> {
    let newsroomAddress: string | undefined;

    this.setState({
      gqlLoading: true,
      gqlError: null,
    });
    try {
      newsroomAddress = await this.getNewsroomAddressFromChannels();
    } catch (e) {
      console.error("Failed to fetch newsroom channels from graphql:", e);
      // but this doesn't really matter, we can fall through to other sources of user newsrooms below
    }

    if (!newsroomAddress) {
      newsroomAddress = this.props.currentUserNewsrooms.first();
    }

    if (!newsroomAddress) {
      try {
        const result = (await this.props.client.query({
          query: NEWSROOMS_QUERY,
        })) as any;
        if (result && result.data && result.data.nrsignupNewsroom && result.data.nrsignupNewsroom.newsroomAddress) {
          newsroomAddress = result.data.nrsignupNewsroom.newsroomAddress;
        }
      } catch (e) {
        if (e.message.indexOf("No jsonb found") !== -1) {
          // This user hasn't created newsroom yet
        } else {
          console.error("Failed to fetch newsroom address from graphql:", e);
          this.setState({
            gqlLoading: false,
            gqlError: e,
          });
          return;
        }
      }
    }

    if (newsroomAddress) {
      this.props.dispatch!(addUserNewsroom(newsroomAddress));
    }
    this.setState({
      newsroomAddress,
      gqlLoading: false,
    });
  }

  private async getNewsroomAddressFromChannels(): Promise<EthAddress | undefined> {
    const result = (await this.props.client.query({
      query: newsroomChannelAdminQuery,
    })) as any;
    const newsroomAddresses = newsroomChannelsFromQueryData(result && result.data);

    if (newsroomAddresses.length === 1) {
      return newsroomAddresses[0];
    } else if (newsroomAddresses.length > 1) {
      this.setState({ multipleNewsrooms: true });
      return undefined;
    } else {
      return undefined;
    }
  }

  private async fetchNewsroomData(): Promise<void> {
    if (!this.props.newsroom && this.props.currentUserNewsrooms.first()) {
      this.props.dispatch!(fetchAndAddListingData(this.context, this.props.currentUserNewsrooms.first()));
    }
    if (this.props.newsroom && !this.props.charter) {
      this.props.dispatch!(await getContent(this.context, this.props.newsroom.wrapper.data.charterHeader!));
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

  return {
    ...ownProps,
    useGraphQL,
    currentUserNewsrooms,
    newsroom,
    charter,
  };
};

const ComposedBoostCreatePage = compose(
  withApollo,
  connect(mapStateToProps),
)(BoostCreatePage);

export default (props: any) => (
  <AuthenticatedRoute
    redirectTo={routes.BOOST_CREATE}
    authUrl={routes.AUTH_LOGIN}
    render={() => <ComposedBoostCreatePage {...props} />}
  />
);
