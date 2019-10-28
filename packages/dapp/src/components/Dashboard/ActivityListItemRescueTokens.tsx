import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { BigNumber } from "@joincivil/typescript-types";
import { UserChallengeData } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-signup";
import { DashboardActivitySelectableItem } from "@joincivil/components";
import { getFormattedTokenBalance } from "@joincivil/utils";
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
import { CivilHelperContext, CivilHelper } from "../../apis/CivilHelper";

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
  userChallengeData?: UserChallengeData;
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
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public async componentDidMount(): Promise<void> {
    console.log("activity list item rescue tokens.");
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
    const { newsroom, challengeID, challenge, dispatch } = this.props;
    if (newsroom) {
      dispatch!(await getContent(this.context, newsroom.wrapper.data.charterHeader!));
    }
    if (challengeID && !challenge) {
      console.error("ActivityListItemRescueTokens without challenge data. challengeID: ", challengeID);
    }
  };
}

class ProposalRescueTokensComponent extends React.Component<
  ProposalItemRescueTokensComponentProps & DispatchProp<any>
> {
  public static contextType = CivilHelperContext;
  public context: CivilHelper;

  public render(): JSX.Element {
    const { proposal, challenge, challengeDataRequestStatus, challengeID, userChallengeData } = this.props;

    if (!challenge && !challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddParameterProposalChallengeData(this.context, challengeID! as string));
    }

    let title = "Parameter Proposal Challenge";
    if (proposal) {
      title = `${title}: ${proposal.paramName} = ${proposal.propValue}`;
    }

    const viewProps = {
      title,
      challengeID,
      salt: userChallengeData && userChallengeData.salt,
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
    console.log("ActivityListItemRescueTokens 1. props: ", ownProps);
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

    return {
      listingAddress,
      newsroom,
      challenge,
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
