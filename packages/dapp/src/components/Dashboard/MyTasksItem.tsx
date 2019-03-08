import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { formatRoute } from "react-router-named-routes";
import {
  ListingWrapper,
  WrappedChallengeData,
  AppealData,
  AppealChallengeData,
  UserChallengeData,
  CharterData,
  EthAddress,
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

import MyTasksItemPhaseCountdown from "./MyTasksItemPhaseCountdown";
import DashboardItemChallengeResults from "./ChallengeSummary";

export interface ActivityListItemOwnProps {
  challengeID?: string;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface ViewDetailURLProps {
  listingDetailURL: string;
  viewDetailURL: string;
}

export interface ActivityListItemReduxProps {
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

export type MyTasksItemSubComponentProps = ActivityListItemOwnProps & ViewDetailURLProps & ActivityListItemReduxProps;

class MyTasksItemComponent extends React.Component<
  ActivityListItemOwnProps & ActivityListItemReduxProps & DispatchProp<any>
> {
  public async componentDidUpdate(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public async componentDidMount(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public render(): JSX.Element {
    const {
      listingAddress: address,
      listing,
      newsroom,
      charter,
      challengeID,
      userChallengeData,
      challengeState,
    } = this.props;

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
            <MyTasksItemPhaseCountdown {...this.props} />
            {!inCommitPhase &&
              !inRevealPhase && (
                <DashboardItemChallengeResults
                  listingDetailURL={listingDetailURL}
                  viewDetailURL={viewDetailURL}
                  {...this.props}
                />
              )}
          </DashboardActivityItemTask>
        );
      }
    }

    return <></>;
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

const makeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ActivityListItemOwnProps,
  ): ActivityListItemOwnProps & ActivityListItemReduxProps => {
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

export default connect(makeMapStateToProps)(MyTasksItemComponent);
