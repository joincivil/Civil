import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "bignumber.js";

import { State } from "../../../redux/reducers";
import {
  makeGetListingAddressByChallengeID,
  makeGetListingAddressByAppealChallengeID,
  makeGetUserChallengeData,
  makeGetUserAppealChallengeData,
  makeGetChallenge,
  makeGetParameterProposalChallenge,
  getAppealChallengeParentChallenge,
  makeGetUserProposalChallengeData,
  makeGetProposalByChallengeID,
} from "../../../selectors";
import { getContent } from "../../../redux/actionCreators/newsrooms";
import { fetchAndAddChallengeData } from "../../../redux/actionCreators/challenges";
import { fetchAndAddParameterProposalChallengeData } from "../../../redux/actionCreators/parameterizer";
import { ClaimRewardsItemOwnProps, ClaimRewardsViewComponentProps, ProposalClaimRewardsComponentProps } from "./types";
import { ClaimRewardsViewComponent, ProposalClaimRewardsViewComponent } from "./ClaimRewardsViewComponents";

interface ClaimRewardsChallengeProp {
  challenge?: any;
  challengeDataRequestStatus?: any;
}

class ClaimRewardsItemReduxWrapperComponent extends React.Component<
  ClaimRewardsItemOwnProps & ClaimRewardsViewComponentProps & ClaimRewardsChallengeProp & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public async componentDidUpdate(): Promise<void> {
    await this.ensureListingAndNewsroomData();
  }

  public render(): JSX.Element {
    return <ClaimRewardsViewComponent {...this.props} />;
  }

  private ensureListingAndNewsroomData = async (): Promise<void> => {
    const { newsroom, challengeID, challenge, challengeDataRequestStatus, dispatch } = this.props;
    if (newsroom && newsroom.data && newsroom.data.charterHeader) {
      dispatch!(await getContent(newsroom.data.charterHeader));
    }
    if (challengeID && !challenge && !challengeDataRequestStatus) {
      dispatch!(fetchAndAddChallengeData(challengeID! as string));
    }
  };
}

class ClaimRewardsProposalItemReduxWrapperComponent extends React.Component<
  ClaimRewardsItemOwnProps & ProposalClaimRewardsComponentProps & ClaimRewardsChallengeProp & DispatchProp<any>
> {
  public async componentDidMount(): Promise<void> {
    await this.ensureProposalData();
  }

  public async componentDidUpdate(): Promise<void> {
    await this.ensureProposalData();
  }

  public render(): JSX.Element {
    return <ProposalClaimRewardsViewComponent {...this.props} />;
  }

  private ensureProposalData = async (): Promise<void> => {
    const { challengeID, challenge, challengeDataRequestStatus } = this.props;
    if (!challenge && !challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddParameterProposalChallengeData(challengeID! as string));
    }
  };
}

const makeChallengeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getListingAddressByAppealChallengeID = makeGetListingAddressByAppealChallengeID();
  const getChallenge = makeGetChallenge();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ClaimRewardsItemOwnProps,
  ): ClaimRewardsItemOwnProps & ClaimRewardsViewComponentProps & ClaimRewardsChallengeProp => {
    const { challengesFetching } = state.networkDependent;
    const { newsrooms } = state;

    let listingAddress;
    let userChallengeData;
    let challenge;

    if (ownProps.appealChallengeID) {
      listingAddress = getListingAddressByAppealChallengeID(state, ownProps);
      userChallengeData = getUserAppealChallengeData(state, ownProps);
      challenge = getAppealChallengeParentChallenge(state, ownProps);
    } else {
      listingAddress = getListingAddressByChallengeID(state, ownProps);
      userChallengeData = getUserChallengeData(state, ownProps);
      challenge = getChallenge(state, ownProps);
    }

    const newsroom = listingAddress ? newsrooms.get(listingAddress) : undefined;

    const unclaimedRewardAmount = (userChallengeData && userChallengeData.voterReward) || new BigNumber(0);
    let challengeDataRequestStatus;
    if (ownProps.challengeID) {
      challengeDataRequestStatus = challengesFetching.get(ownProps.challengeID as string);
    }

    return {
      listingAddress,
      newsroom,
      challenge,
      challengeDataRequestStatus,
      userChallengeData,
      unclaimedRewardAmount,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

const makeProposalMapStateToProps = () => {
  const getUserProposalChallengeData = makeGetUserProposalChallengeData();
  const getParameterProposalChallenge = makeGetParameterProposalChallenge();
  const getProposalByChallengeID = makeGetProposalByChallengeID();

  const mapStateToProps = (
    state: State,
    ownProps: ClaimRewardsItemOwnProps,
  ): ClaimRewardsItemOwnProps & ProposalClaimRewardsComponentProps & ClaimRewardsChallengeProp => {
    const { parameterProposalChallengesFetching } = state.networkDependent;
    const proposal = getProposalByChallengeID(state, ownProps);
    const challenge = getParameterProposalChallenge(state, ownProps);
    const userChallengeData = getUserProposalChallengeData(state, ownProps);
    const unclaimedRewardAmount = (userChallengeData && userChallengeData.voterReward) || new BigNumber(0);
    let challengeDataRequestStatus;
    if (ownProps.challengeID) {
      challengeDataRequestStatus = parameterProposalChallengesFetching.get(ownProps.challengeID as string);
    }

    return {
      proposal,
      challenge,
      challengeDataRequestStatus,
      userChallengeData,
      unclaimedRewardAmount,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export const ClaimRewardsProposalItemReduxWrapper = connect(makeProposalMapStateToProps)(
  ClaimRewardsProposalItemReduxWrapperComponent,
);

export const ClaimRewardsItemReduxWrapper = connect(makeChallengeMapStateToProps)(
  ClaimRewardsItemReduxWrapperComponent,
);
