import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { CharterData } from "@joincivil/core";

import { State } from "../../../redux/reducers";
import { ListingWrapperWithExpiry } from "../../../redux/reducers/listings";
import { fetchAndAddListingData } from "../../../redux/actionCreators/listings";
import { getContent } from "../../../redux/actionCreators/newsrooms";
import {
  getChallenge,
  makeGetListingAddressByChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  getChallengeState,
  getAppealChallengeState,
} from "../../../selectors";
import { MyTasksItemOwnProps, MyTasksItemReduxProps } from "./MyTasksItemTypes";
import MyTasksItemComponent from "./MyTasksItemComponent";

class MyTasksItemReduxWrapper extends React.Component<MyTasksItemOwnProps & MyTasksItemReduxProps & DispatchProp<any>> {
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

const makeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: MyTasksItemOwnProps,
  ): MyTasksItemOwnProps & MyTasksItemReduxProps => {
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

export default connect(makeMapStateToProps)(MyTasksItemReduxWrapper);
