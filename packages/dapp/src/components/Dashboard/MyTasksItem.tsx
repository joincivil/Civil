import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import { Query } from "react-apollo";
import { BigNumber } from "bignumber.js";
import { Map } from "immutable";

import {
  ContentData,
  ListingWrapper,
  WrappedChallengeData,
  AppealData,
  AppealChallengeData,
  UserChallengeData,
  CharterData,
  EthAddress,
  EthContentHeader,
} from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { DashboardActivityItemTask } from "@joincivil/components";

import { routes } from "../../constants";
import { State } from "../../redux/reducers";
import { ListingWrapperWithExpiry } from "../../redux/reducers/listings";
import {
  getChallenge,
  makeGetListingAddressByChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  getChallengeState,
  getAppealChallengeState,
} from "../../selectors";
import { fetchAndAddListingData } from "../../redux/actionCreators/listings";
import { getContent } from "../../redux/actionCreators/newsrooms";
import {
  CHALLENGE_QUERY,
  LISTING_QUERY,
  transformGraphQLDataIntoListing,
  transformGraphQLDataIntoNewsroom,
  transformGraphQLDataIntoChallenge,
  transfromGraphQLDataIntoUserChallengeData,
} from "../../helpers/queryTransformations";

import MyTasksItemPhaseCountdown from "./MyTasksItemPhaseCountdown";
import DashboardItemChallengeResults from "./ChallengeSummary";

export interface MyTasksItemOwnProps {
  challengeID?: string;
  queryUserChallengeData?: UserChallengeData;
  queryUserAppealChallengeData?: UserChallengeData;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface ViewDetailURLProps {
  listingDetailURL: string;
  viewDetailURL: string;
}

export interface MyTaskItemReduxProps {
  challenge?: WrappedChallengeData;
  challengeState?: any;
  userChallengeData?: UserChallengeData;
  appeal?: AppealData;
  appealChallengeID?: string;
  appealChallenge?: AppealChallengeData;
  appealChallengeState?: any;
  appealUserChallengeData?: UserChallengeData;
  user?: EthAddress;
  newsroom?: NewsroomState;
  charter?: CharterData;
  listingAddress?: string;
  listing?: ListingWrapper;
  listingDataRequestStatus?: any;
}

export type MyTasksItemSubComponentProps = MyTasksItemOwnProps & ViewDetailURLProps & MyTaskItemReduxProps;

const MyTasksItemComponent: React.FunctionComponent<MyTasksItemOwnProps & MyTaskItemReduxProps> = props => {
  const { listingAddress: address, listing, newsroom, charter, challengeID, userChallengeData, challengeState } = props;

  if (!userChallengeData || !challengeState) {
    return <></>;
  }

  const { canUserCollect, canUserRescue, didUserCommit } = userChallengeData;
  const { inCommitPhase, inRevealPhase } = challengeState;

  if (listing && listing.data && newsroom) {
    const newsroomData = newsroom.wrapper.data;
    const listingDetailURL = formatRoute(routes.LISTING, { listingAddress: address });
    let viewDetailURL = listingDetailURL;
    const title = `${newsroomData.name} Challenge #${challengeID}`;
    const logoUrl = charter && charter.logoUrl;

    if (canUserCollect || canUserRescue) {
      viewDetailURL = formatRoute(routes.CHALLENGE, { listingAddress: address, challengeID });
    }

    const viewProps = {
      title,
      logoUrl,
      viewDetailURL,
    };

    if (canUserCollect || canUserRescue || didUserCommit) {
      return (
        <DashboardActivityItemTask {...viewProps}>
          <MyTasksItemPhaseCountdown {...props} />
          {!inCommitPhase &&
            !inRevealPhase && (
              <DashboardItemChallengeResults
                listingDetailURL={listingDetailURL}
                viewDetailURL={viewDetailURL}
                {...props}
              />
            )}
        </DashboardActivityItemTask>
      );
    }
  }

  return <></>;
};

class MyTasksItemReduxWrapper extends React.Component<MyTasksItemOwnProps & MyTaskItemReduxProps & DispatchProp<any>> {
  public async componentDidUpdate(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public async componentDidMount(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public render(): JSX.Element {
    return <MyTasksItemComponent {...this.props} />;
  }

  private ensureListingAndNewsroomData = async (): Promise<void> => {
    if (!this.props.listing && !this.props.listingDataRequestStatus && this.props.listingAddress) {
      this.props.dispatch!(fetchAndAddListingData(this.props.listingAddress!));
    }
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.wrapper.data.charterHeader!));
    }
  };
}

const MyTasksItemApolloQueryWrapper: React.FunctionComponent<
  MyTasksItemOwnProps & MyTasksItemWrapperReduxProps
> = props => {
  const { challengeID, queryUserChallengeData, queryUserAppealChallengeData, content, getCharterContent } = props;
  return (
    <Query query={CHALLENGE_QUERY} variables={{ challengeID }}>
      {({ loading, error, data: graphQLChallengeData }: any) => {
        if (error || loading || !graphQLChallengeData) {
          return <></>;
        }
        const listingAddress = graphQLChallengeData.challenge.listingAddress;

        return (
          <Query query={LISTING_QUERY} variables={{ addr: listingAddress }}>
            {({ loading: listingLoading, error: listingError, data: listingData }: any): JSX.Element => {
              if (listingLoading || listingError || !listingData) {
                return <></>;
              }

              const userChallengeData = transfromGraphQLDataIntoUserChallengeData(
                queryUserChallengeData,
                graphQLChallengeData.challenge,
              );
              const challenge = transformGraphQLDataIntoChallenge(graphQLChallengeData.challenge);
              const listing = transformGraphQLDataIntoListing(listingData.listing, listingAddress);
              const newsroom = { wrapper: transformGraphQLDataIntoNewsroom(listingData.listing, listingAddress) };

              let appealUserChallengeData;
              if (queryUserAppealChallengeData) {
                appealUserChallengeData = transfromGraphQLDataIntoUserChallengeData(
                  queryUserAppealChallengeData,
                  graphQLChallengeData.challenge.appeal.appealChallenge,
                );
              }

              let charter;
              if (newsroom.wrapper && newsroom.wrapper.data.charterHeader) {
                charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
                if (!charter) {
                  getCharterContent(newsroom.wrapper.data.charterHeader);
                }
              }

              const wrappedChallenge = {
                listingAddress,
                challengeID: new BigNumber(props.challengeID!),
                challenge,
              };

              let appeal;
              let appealChallenge;
              let appealChallengeState;
              let appealChallengeID;

              if (challenge) {
                appeal = challenge.appeal;

                if (appeal) {
                  appealChallenge = appeal.appealChallenge;
                  if (appealChallenge) {
                    appealChallengeID = appeal.appealChallengeID.toString();
                    appealChallengeState = getAppealChallengeState(appealChallenge);
                  }
                }
              }

              const challengeState = getChallengeState(wrappedChallenge as WrappedChallengeData);
              const viewProps = {
                challengeID,
                listingAddress,
                listing,
                newsroom,
                charter,
                challenge: wrappedChallenge,
                challengeState,
                userChallengeData,
                appeal,
                appealChallengeID,
                appealChallenge,
                appealChallengeState,
                appealUserChallengeData,
              };

              return <MyTasksItemComponent {...viewProps} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
};

const makeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (state: State, ownProps: MyTasksItemOwnProps): MyTasksItemOwnProps & MyTaskItemReduxProps => {
    const { newsrooms } = state;
    const { user, content, listings, listingsFetching } = state.networkDependent;
    const userAcct = user && user.account.account;

    const listingAddress = getListingAddressByChallengeID(state, ownProps);
    const challenge = getChallenge(state, ownProps);
    const challengeState = getChallengeState(challenge!);
    const userChallengeData = getUserChallengeData(state, ownProps);

    const appeal = challenge && challenge.challenge.appeal;
    const appealChallengeID = appeal && appeal.appealChallengeID && appeal.appealChallengeID.toString();
    const appealChallenge = appeal && appeal.appealChallenge;

    let appealChallengeState;
    let appealUserChallengeData;
    if (appealChallenge) {
      appealChallengeState = getAppealChallengeState(appealChallenge);
      appealUserChallengeData = getUserAppealChallengeData(state, ownProps);
    }

    const listing = (listingAddress && listings.get(listingAddress)) as ListingWrapperWithExpiry | undefined;
    const newsroom = listingAddress ? newsrooms.get(listingAddress) : undefined;
    let charter;
    if (newsroom && newsroom.wrapper.data.charterHeader) {
      charter = content.get(newsroom.wrapper.data.charterHeader.uri) as CharterData;
    }
    let listingDataRequestStatus;
    if (listingAddress) {
      listingDataRequestStatus = listingsFetching.get(listingAddress.toString());
    }

    return {
      listingAddress,
      challenge,
      challengeState,
      userChallengeData,
      appeal,
      appealChallengeID,
      appealChallenge,
      appealChallengeState,
      appealUserChallengeData,
      user: userAcct,
      listingDataRequestStatus,
      newsroom,
      charter,
      listing: listing && listing.listing,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

const MyTasksItemReduxComponent = connect(makeMapStateToProps)(MyTasksItemReduxWrapper);

interface MyTasksItemWrapperReduxProps {
  useGraphQL?: boolean;
  userAcct: EthAddress;
  content: Map<string, ContentData>;
  getCharterContent(charterHeader: EthContentHeader): Promise<void>;
}

const MyTasksItemWrapper: React.FunctionComponent<MyTasksItemOwnProps & MyTasksItemWrapperReduxProps & DispatchProp<any>> = props => {
  const {
    useGraphQL,
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    userAcct,
    content,
    dispatch,
  } = props;

  const viewProps = {
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    userAcct,
    content,
  };

  const getCharterContent = async (charterHeader: EthContentHeader) => { dispatch!(await getContent(charterHeader)) };

  if (useGraphQL) {
    return (
      <MyTasksItemApolloQueryWrapper
        {...viewProps}
        queryUserChallengeData={queryUserChallengeData}
        queryUserAppealChallengeData={queryUserAppealChallengeData}
        getCharterContent={getCharterContent}
      />
    );
  }

  return <MyTasksItemReduxComponent {...viewProps} />;
};

const mapStateToPropsMyTasksItemWrapper = (
  state: State,
  ownProps: MyTasksItemOwnProps,
): MyTasksItemOwnProps & MyTasksItemWrapperReduxProps => {
  const { useGraphQL } = state;
  const { content, user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { useGraphQL, content, userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyTasksItemWrapper)(MyTasksItemWrapper);
