import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Link } from "react-router-dom";
import { formatRoute } from "react-router-named-routes";
import { compose, withApollo, WithApolloClient } from "react-apollo";
import { Helmet } from "react-helmet";
import gql from "graphql-tag";
import { Set } from "immutable";
import styled from "styled-components";

import { NewsroomState } from "@joincivil/newsroom-signup";
import { CharterData, EthAddress } from "@joincivil/core";
import { BoostForm } from "@joincivil/civil-sdk";
import { FeatureFlag, AuthenticatedRoute, ErrorLoadingData, LoadingMessage } from "@joincivil/components";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import ScrollToTopOnMount from "../utility/ScrollToTop";
import { addUserNewsroom, getContent } from "../../redux/actionCreators/newsrooms";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { ComingSoonText } from "./BoostStyledComponents";
import { StyledInPageMsgContainer } from "../utility/styledComponents";

const NoNewsroomMessage = styled.div`
  font-size: 16px;
  margin: 0 auto;
  max-width: 640px;
  padding: 20px;
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
    if (!this.state.gqlLoading && !this.state.newsroomAddress) {
      return (
        <StyledInPageMsgContainer>
          <NoNewsroomMessage>
            Your have not yet created a newsroom. Please{" "}
            <Link to={routes.APPLY_TO_REGISTRY}>create your newsroom application</Link> and then, once you have applied
            to the registry and your newsroom has been approved, you can return to create a Boost.
          </NoNewsroomMessage>
        </StyledInPageMsgContainer>
      );
    }
    if (this.state.gqlError) {
      // useGraphQL flase to suppress "turn off graphql" message because that won't fix it here
      return (
        <StyledInPageMsgContainer>
          <ErrorLoadingData useGraphQL={false} />
        </StyledInPageMsgContainer>
      );
    }
    if (this.state.gqlLoading || !this.props.newsroom || !this.props.charter) {
      return <LoadingMessage />;
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
        gqlError: null,
      });
      try {
        const result = (await this.props.client.query({
          query: NEWSROOMS_QUERY,
        })) as any;
        if (!result || !result.data || !result.data.nrsignupNewsroom || !result.data.nrsignupNewsroom.newsroomAddress) {
          // This user hasn't created newsroom yet
          this.setState({
            gqlLoading: false,
            newsroomAddress: undefined,
          });
          return;
        }
        this.setState({
          gqlLoading: false,
          newsroomAddress: result.data.nrsignupNewsroom.newsroomAddress,
        });
        this.props.dispatch!(addUserNewsroom(result.data.nrsignupNewsroom.newsroomAddress));
      } catch (e) {
        if (e.message.indexOf("No jsonb found") !== -1) {
          // This user hasn't created newsroom yet
          this.setState({
            gqlLoading: false,
            newsroomAddress: undefined,
          });
        }
        this.setState({
          gqlLoading: false,
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

  return {
    ...ownProps,
    useGraphQL,
    currentUserNewsrooms,
    newsroom,
    charter,
  };
};

const ComposedBoostCreatePage = compose(withApollo, connect(mapStateToProps))(BoostCreatePage);

export default (props: any) => (
  <AuthenticatedRoute
    redirectTo={routes.BOOST_CREATE}
    signupUrl={routes.AUTH_SIGNUP}
    render={() => <ComposedBoostCreatePage {...props} />}
  />
);
