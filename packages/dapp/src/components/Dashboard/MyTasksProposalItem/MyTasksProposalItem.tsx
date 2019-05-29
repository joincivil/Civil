import * as React from "react";
import { connect } from "react-redux";

import { State } from "../../../redux/reducers";
import { MyTasksProposalItemOwnProps, MyTasksProposalItemWrapperReduxProps } from "./MyTasksProposalItemTypes";
import MyTasksProposalItemApolloQueryWrapper from "./MyTasksProposalItemApolloQueryWrapper";
import MyTasksProposalItemReduxComponent from "./MyTasksProposalItemReduxComponent";

const MyTasksProposalItemWrapper: React.FunctionComponent<
  MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps
> = props => {
  const { useGraphQL, challengeID, showClaimRewardsTab, showRescueTokensTab, queryUserChallengeData, userAcct } = props;

  const viewProps = {
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    userAcct,
  };

  if (useGraphQL) {
    return <MyTasksProposalItemApolloQueryWrapper {...viewProps} queryUserChallengeData={queryUserChallengeData} />;
  }

  return <MyTasksProposalItemReduxComponent {...viewProps} />;
};

const mapStateToPropsMyTasksProposalItemWrapper = (
  state: State,
  ownProps: MyTasksProposalItemOwnProps,
): MyTasksProposalItemOwnProps & MyTasksProposalItemWrapperReduxProps => {
  const { useGraphQL } = state;
  const { user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { useGraphQL, userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyTasksProposalItemWrapper)(MyTasksProposalItemWrapper);
