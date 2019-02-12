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

export interface ActivityListItemRescueTokensOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface ActivityListItemRescueTokensReduxProps {
  listingAddress?: string;
  newsroom?: NewsroomState;
  userChallengeData?: UserChallengeData;
  rescueTokensAmount: string;
}

type ActivityListItemRescueTokensComponentProps = ActivityListItemRescueTokensOwnProps &
  ActivityListItemRescueTokensReduxProps;

class ActivityListItemRescueTokensComponent extends React.Component<
  ActivityListItemRescueTokensComponentProps & DispatchProp<any>
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
      numTokens: this.props.rescueTokensAmount!,
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
    ownProps: ActivityListItemRescueTokensOwnProps,
  ): ActivityListItemRescueTokensComponentProps => {
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

    const rescueTokensAmountBN = userChallengeData && userChallengeData.numTokens;
    let rescueTokensAmount = "";
    if (rescueTokensAmountBN) {
      rescueTokensAmount = getFormattedTokenBalance(rescueTokensAmountBN);
    }

    return {
      listingAddress,
      newsroom,
      userChallengeData,
      rescueTokensAmount,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeChallengeMapStateToProps)(ActivityListItemRescueTokensComponent);
