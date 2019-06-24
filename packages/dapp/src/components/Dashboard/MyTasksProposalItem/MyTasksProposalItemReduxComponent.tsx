import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { State } from "../../../redux/reducers";
import { fetchAndAddParameterProposalChallengeData } from "../../../redux/actionCreators/parameterizer";
import {
  makeGetParameterProposalChallenge,
  makeGetUserProposalChallengeData,
  makeGetProposalByChallengeID,
} from "../../../selectors";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemReduxProps } from "./MyTasksProposalItemTypes";
import MyTasksProposalItemComponent from "./MyTasksProposalItemComponent";

class MyTasksProposalItemReduxWrapper extends React.Component<
  MyTasksProposalItemOwnProps & MyTasksProposalItemReduxProps & DispatchProp<any>
> {
  public async componentDidUpdate(): Promise<void> {
    await this.ensureProposalChallengeData();
  }

  public async componentDidMount(): Promise<void> {
    await this.ensureProposalChallengeData();
  }

  public render(): JSX.Element {
    return <MyTasksProposalItemComponent {...this.props} />;
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
  ): MyTasksProposalItemOwnProps & MyTasksProposalItemReduxProps => {
    const { parameterProposalChallengesFetching } = state.networkDependent;
    const proposal = getProposalByChallengeID(state, ownProps);
    const challenge = getParameterProposalChallenge(state, ownProps);
    const userChallengeData = getUserProposalChallengeData(state, ownProps);
    let challengeDataRequestStatus;
    if (ownProps.challengeID) {
      challengeDataRequestStatus = parameterProposalChallengesFetching.get(ownProps.challengeID as string);
    }

    return {
      proposal,
      challenge,
      challengeDataRequestStatus,
      userChallengeData,
      ...ownProps,
    };
  };

  return mapStateToProps;
};

export default connect(makeProposalMapStateToProps)(MyTasksProposalItemReduxWrapper);
