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

export interface ActivityListItemRescueTokensOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  isProposalChallenge?: boolean;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface ActivityListItemRescueTokensReduxProps {
  listingAddress?: string;
  newsroom?: NewsroomState;
  userChallengeData?: UserChallengeData;
  rescueTokensAmount: string;
  challenge?: any;
  challengeDataRequestStatus?: any;
}

export interface ProposalItemRescueTokensReduxProps {
  proposal?: any;
  proposalUserChallengeData?: UserChallengeData;
  rescueTokensAmount: string;
  challenge?: any;
  challengeDataRequestStatus?: any;
}

type ActivityListItemRescueTokensComponentProps = ActivityListItemRescueTokensOwnProps &
  ActivityListItemRescueTokensReduxProps;

type ProposalItemRescueTokensComponentProps = ActivityListItemRescueTokensOwnProps & ProposalItemRescueTokensReduxProps;

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
    const { newsroom, challengeID, challenge, challengeDataRequestStatus, dispatch } = this.props;
    if (newsroom) {
      dispatch!(await getContent(newsroom.wrapper.data.charterHeader!));
    }
    if (challengeID && !challenge && !challengeDataRequestStatus) {
      dispatch!(fetchAndAddChallengeData(challengeID! as string));
    }
  };
}

class ProposalRescueTokensComponent extends React.Component<
  ProposalItemRescueTokensComponentProps & DispatchProp<any>
> {
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
      numTokens: this.props.rescueTokensAmount!,
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
    ownProps: ActivityListItemRescueTokensOwnProps,
  ): ActivityListItemRescueTokensComponentProps => {
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

    const rescueTokensAmountBN = userChallengeData && userChallengeData.numTokens;
    let rescueTokensAmount = "";
    if (rescueTokensAmountBN) {
      rescueTokensAmount = getFormattedTokenBalance(rescueTokensAmountBN);
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
      rescueTokensAmount,
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
    ownProps: ActivityListItemRescueTokensOwnProps,
  ): ProposalItemRescueTokensComponentProps => {
    const { parameterProposalChallengesFetching } = state.networkDependent;
    const proposal = getProposalByChallengeID(state, ownProps);
    const challenge = getParameterProposalChallenge(state, ownProps);
    const proposalUserChallengeData = getUserProposalChallengeData(state, ownProps);
    const rescueTokensAmountBN = proposalUserChallengeData && proposalUserChallengeData.numTokens;
    let rescueTokensAmount = "";
    if (rescueTokensAmountBN) {
      rescueTokensAmount = getFormattedTokenBalance(rescueTokensAmountBN);
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
      rescueTokensAmount,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

const ProposalRescueTokens = connect(makeProposalMapStateToProps)(ProposalRescueTokensComponent);

const ActivityListItemRescueTokens = connect(makeChallengeMapStateToProps)(ActivityListItemRescueTokensComponent);

const RescueTokens: React.FunctionComponent<ActivityListItemRescueTokensOwnProps> = props => {
  if (props.isProposalChallenge) {
    return <ProposalRescueTokens {...props} />;
  }

  return <ActivityListItemRescueTokens {...props} />;
};

export default RescueTokens;
