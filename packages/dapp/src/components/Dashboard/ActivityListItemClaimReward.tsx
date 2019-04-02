import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import BigNumber from "bignumber.js";
import { UserChallengeData } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { DashboardActivitySelectableItem } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { fetchAndAddChallengeData } from "../../redux/actionCreators/challenges";
import { fetchAndAddParameterProposalChallengeData } from "../../redux/actionCreators/parameterizer";
import { State } from "../../redux/reducers";
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
} from "../../selectors";
import { getContent } from "../../redux/actionCreators/newsrooms";

export interface ActivityListItemClaimRewardOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  isProposalChallenge?: boolean;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface ActivityListItemClaimRewardReduxProps {
  listingAddress?: string;
  newsroom?: NewsroomState;
  userChallengeData?: UserChallengeData;
  unclaimedRewardAmount: string;
  challenge?: any;
  challengeDataRequestStatus?: any;
}

export interface ProposalItemClaimRewardReduxProps {
  proposal?: any;
  proposalUserChallengeData?: UserChallengeData;
  unclaimedRewardAmount: string;
  challenge?: any;
  challengeDataRequestStatus?: any;
}

type ActivityListItemClaimRewardComponentProps = ActivityListItemClaimRewardOwnProps &
  ActivityListItemClaimRewardReduxProps;

type ProposalItemClaimRewardComponentProps = ActivityListItemClaimRewardOwnProps & ProposalItemClaimRewardReduxProps;

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
    const { newsroom, challengeID, challenge, challengeDataRequestStatus, dispatch } = this.props;
    if (newsroom) {
      dispatch!(await getContent(newsroom.wrapper.data.charterHeader!));
    }
    if (challengeID && !challenge && !challengeDataRequestStatus) {
      dispatch!(fetchAndAddChallengeData(challengeID! as string));
    }
  };
}

class ProposalClaimRewardComponent extends React.Component<ProposalItemClaimRewardComponentProps & DispatchProp<any>> {
  public render(): JSX.Element {
    const { proposal, challenge, challengeDataRequestStatus, challengeID, proposalUserChallengeData } = this.props;

    if (!challenge && !challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddParameterProposalChallengeData(challengeID! as string));
    }

    let title = "Parameter Proposal Challenge";
    if (proposal) {
      title = `${title}: ${proposal.paramName} = ${proposal.propValue}`;
    }

    const viewProps = {
      title,
      challengeID,
      salt: proposalUserChallengeData && proposalUserChallengeData.salt,
      numTokens: this.props.unclaimedRewardAmount!,
      toggleSelect: this.props.toggleSelect,
    };

    return <DashboardActivitySelectableItem {...viewProps} />;
  }
}

const makeChallengeMapStateToProps = () => {
  const getListingAddressByChallengeID = makeGetListingAddressByChallengeID();
  const getListingAddressByAppealChallengeID = makeGetListingAddressByAppealChallengeID();
  const getChallenge = makeGetChallenge();
  const getUserChallengeData = makeGetUserChallengeData();
  const getUserAppealChallengeData = makeGetUserAppealChallengeData();

  const mapStateToProps = (
    state: State,
    ownProps: ActivityListItemClaimRewardOwnProps,
  ): ActivityListItemClaimRewardComponentProps => {
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

    const unclaimedRewardAmountBN = userChallengeData && userChallengeData.voterReward;
    let unclaimedRewardAmount = "";
    if (unclaimedRewardAmountBN) {
      unclaimedRewardAmount = getFormattedTokenBalance(unclaimedRewardAmountBN);
    }
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
    ownProps: ActivityListItemClaimRewardOwnProps,
  ): ProposalItemClaimRewardComponentProps => {
    const { parameterProposalChallengesFetching } = state.networkDependent;
    const proposal = getProposalByChallengeID(state, ownProps);
    const challenge = getParameterProposalChallenge(state, ownProps);
    const proposalUserChallengeData = getUserProposalChallengeData(state, ownProps);
    const unclaimedRewardAmountBN = proposalUserChallengeData && proposalUserChallengeData.voterReward;
    let unclaimedRewardAmount = "";
    if (unclaimedRewardAmountBN) {
      unclaimedRewardAmount = getFormattedTokenBalance(unclaimedRewardAmountBN);
    }
    let challengeDataRequestStatus;
    if (ownProps.challengeID) {
      challengeDataRequestStatus = parameterProposalChallengesFetching.get(ownProps.challengeID as string);
    }

    return {
      proposal,
      challenge,
      challengeDataRequestStatus,
      proposalUserChallengeData,
      unclaimedRewardAmount,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

const ProposalClaimReward = connect(makeProposalMapStateToProps)(ProposalClaimRewardComponent);

const ActivityListItemClaimReward = connect(makeChallengeMapStateToProps)(ActivityListItemClaimRewardComponent);

const ClaimReward: React.FunctionComponent<ActivityListItemClaimRewardOwnProps> = props => {
  if (props.isProposalChallenge) {
    return <ProposalClaimReward {...props} />;
  }

  return <ActivityListItemClaimReward {...props} />;
};

export default ClaimReward;
