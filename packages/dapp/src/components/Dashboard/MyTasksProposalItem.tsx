import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  UserChallengeData,
  isParamPropChallengeInCommitStage,
  isParamPropChallengeInRevealStage,
} from "@joincivil/core";
import { DashboardActivityItemTask } from "@joincivil/components";
import { State } from "../../redux/reducers";
import {
  makeGetParameterProposalChallenge,
  makeGetUserProposalChallengeData,
  makeGetProposalByChallengeID,
} from "../../selectors";
import { fetchAndAddParameterProposalChallengeData } from "../../redux/actionCreators/parameterizer";

import MyTasksProposalItemPhaseCountdown from "./MyTasksItemPhaseCountdown";
import DashboardProposalItemChallengeDetails from "./ProposalChallengeSummary";

export interface MyTasksProposalItemOwnProps {
  challengeID?: string;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface ProposalItemReduxProps {
  proposal?: any;
  proposalUserChallengeData?: UserChallengeData;
  challenge?: any;
  challengeDataRequestStatus?: any;
}

export type MyTasksProposalItemSubComponentProps = MyTasksProposalItemOwnProps & ProposalItemReduxProps;

class MyTasksProposalItemComponent extends React.Component<MyTasksProposalItemSubComponentProps & DispatchProp<any>> {
  public async componentDidUpdate(): Promise<void> {
    await this.ensureProposalChallengeData();
  }

  public async componentDidMount(): Promise<void> {
    await this.ensureProposalChallengeData();
  }

  public render(): JSX.Element {
    const { proposal, challengeID, challenge, proposalUserChallengeData } = this.props;

    if (!proposalUserChallengeData || !challenge) {
      return <></>;
    }

    const { canUserReveal, canUserCollect, canUserRescue, didUserCommit } = proposalUserChallengeData;

    let title = `Parameter Proposal Challenge #${challengeID}`;
    if (proposal) {
      title = `${title}: ${proposal.paramName} = ${proposal.propValue}`;
    }

    const viewProps = {
      title,
      viewDetailURL: "/parameterizer",
    };

    const inCommitPhase = isParamPropChallengeInCommitStage(challenge);
    const inRevealPhase = isParamPropChallengeInRevealStage(challenge);

    if (canUserReveal || canUserCollect || canUserRescue || didUserCommit) {
      return (
        <DashboardActivityItemTask {...viewProps}>
          <MyTasksProposalItemPhaseCountdown {...this.props} />
          {!inCommitPhase && !inRevealPhase && <DashboardProposalItemChallengeDetails {...this.props} />}
        </DashboardActivityItemTask>
      );
    }

    return <></>;
  }

  private ensureProposalChallengeData = async (): Promise<void> => {
    const { challengeID, challenge, challengeDataRequestStatus } = this.props;
    if (!challenge && !challengeDataRequestStatus) {
      this.props.dispatch!(fetchAndAddParameterProposalChallengeData(challengeID! as string));
    }
  };
}

const makeProposalMapStateToProps = () => {
  const getUserProposalChallengeData = makeGetUserProposalChallengeData();
  const getParameterProposalChallenge = makeGetParameterProposalChallenge();
  const getProposalByChallengeID = makeGetProposalByChallengeID();

  const mapStateToProps = (
    state: State,
    ownProps: MyTasksProposalItemOwnProps,
  ): MyTasksProposalItemOwnProps & ProposalItemReduxProps => {
    const { parameterProposalChallengesFetching } = state.networkDependent;
    const proposal = getProposalByChallengeID(state, ownProps);
    const challenge = getParameterProposalChallenge(state, ownProps);
    const proposalUserChallengeData = getUserProposalChallengeData(state, ownProps);
    let challengeDataRequestStatus;
    if (ownProps.challengeID) {
      challengeDataRequestStatus = parameterProposalChallengesFetching.get(ownProps.challengeID as string);
    }

    return {
      proposal,
      challenge,
      challengeDataRequestStatus,
      proposalUserChallengeData,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeProposalMapStateToProps)(MyTasksProposalItemComponent);
