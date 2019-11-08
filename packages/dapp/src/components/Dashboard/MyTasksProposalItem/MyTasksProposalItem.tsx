import * as React from "react";
import { connect } from "react-redux";

import { State } from "../../../redux/reducers";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemWrapperReduxProps } from "./MyTasksProposalItemTypes";
import MyTasksProposalItemWrapper from "./MyTasksProposalItemWrapper";

const MyTasksProposalItem: React.FunctionComponent<
  MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps
> = props => {
  const { challengeID, showClaimRewardsTab, showRescueTokensTab, queryUserChallengeData, userAcct } = props;

  const viewProps = {
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    userAcct,
  };
  return <MyTasksProposalItemWrapper {...viewProps} queryUserChallengeData={queryUserChallengeData} />;
};

const mapStateToPropsMyTasksProposalItem = (
  state: State,
  ownProps: MyTasksProposalItemOwnProps,
): MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps => {
  const { user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyTasksProposalItem)(MyTasksProposalItem);
