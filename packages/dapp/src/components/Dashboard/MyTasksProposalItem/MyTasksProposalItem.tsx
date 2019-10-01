import * as React from "react";
import { connect } from "react-redux";

import { State } from "../../../redux/reducers";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemWrapperReduxProps } from "./MyTasksProposalItemTypes";
import MyTasksProposalItemApolloQueryWrapper from "./MyTasksProposalItemApolloQueryWrapper";

const MyTasksProposalItemWrapper: React.FunctionComponent<
  MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps
> = props => {
  const { challengeID, showClaimRewardsTab, showRescueTokensTab, queryUserChallengeData, userAcct } = props;

  const viewProps = {
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    userAcct,
  };
  return <MyTasksProposalItemApolloQueryWrapper {...viewProps} queryUserChallengeData={queryUserChallengeData} />;
};

const mapStateToPropsMyTasksProposalItemWrapper = (
  state: State,
  ownProps: MyTasksProposalItemOwnProps,
): MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps => {
  const { user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyTasksProposalItemWrapper)(MyTasksProposalItemWrapper);
