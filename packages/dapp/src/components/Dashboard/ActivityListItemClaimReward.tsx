import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import BigNumber from "bignumber.js";
import { UserChallengeData } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { DashboardActivitySelectableItem } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { State } from "../../redux/reducers";
import {
  makeGetListingAddressByChallengeID,
  makeGetListingAddressByAppealChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
} from "../../selectors";
import { getContent } from "../../redux/actionCreators/newsrooms";

export interface ActivityListItemClaimRewardOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface ActivityListItemClaimRewardReduxProps {
  listingAddress?: string;
  newsroom?: NewsroomState;
  userChallengeData?: UserChallengeData;
  unclaimedRewardAmount: string;
}

type ActivityListItemClaimRewardComponentProps = ActivityListItemClaimRewardOwnProps &
  ActivityListItemClaimRewardReduxProps;

class ActivityListItemClaimRewardComponent extends React.Component<
  ActivityListItemClaimRewardComponentProps & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public async componentDidUpdate(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public render(): JSX.Element | null {
    const { challengeID, appealChallengeID, newsroom } = this.props;
    if (!(newsroom && (challengeID || appealChallengeID))) {
      return null;
    }

    const newsroomData = newsroom.wrapper.data;

    const props = {
      title: newsroomData.name,
      challengeID,
      appealChallengeID,
      salt: this.props.userChallengeData && this.props.userChallengeData.salt,
      numTokens: this.props.unclaimedRewardAmount!,
      toggleSelect: this.props.toggleSelect,
    };

    return <DashboardActivitySelectableItem {...props} />;
  }

  private ensureListingAndNewsroomData = async (): Promise<void> => {
    if (this.props.newsroom) {
      this.props.dispatch!(await getContent(this.props.newsroom.wrapper.data.charterHeader!));
    }
  };
}

const makeChallengeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getListingAddressByAppealChallengeID = makeGetListingAddressByAppealChallengeID();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ActivityListItemClaimRewardOwnProps,
  ): ActivityListItemClaimRewardComponentProps => {
    const { newsrooms } = state;

    let listingAddress;
    let userChallengeData;

    if (ownProps.appealChallengeID) {
      listingAddress = getListingAddressByAppealChallengeID(state, ownProps);
      userChallengeData = getUserAppealChallengeData(state, ownProps);
    } else {
      listingAddress = getListingAddressByChallengeID(state, ownProps);
      userChallengeData = getUserChallengeData(state, ownProps);
    }

    const newsroom = listingAddress ? newsrooms.get(listingAddress) : undefined;

    const unclaimedRewardAmountBN = userChallengeData && userChallengeData.voterReward;
    let unclaimedRewardAmount = "";
    if (unclaimedRewardAmountBN) {
      unclaimedRewardAmount = getFormattedTokenBalance(unclaimedRewardAmountBN);
    }

    return {
      listingAddress,
      newsroom,
      userChallengeData,
      unclaimedRewardAmount,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeChallengeMapStateToProps)(ActivityListItemClaimRewardComponent);
