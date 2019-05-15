import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import {
  EthContentHeader,
} from "@joincivil/core";

import { State } from "../../../redux/reducers";
import { getContent } from "../../../redux/actionCreators/newsrooms";
import { MyTasksItemOwnProps, MyTasksItemWrapperReduxProps } from "./MyTasksItemTypes";
import MyTasksItemApolloQueryWrapper from "./MyTasksItemApolloQueryWrapper";
import MyTasksItemReduxComponent from "./MyTasksItemReduxComponent";

const MyTasksItemWrapper: React.FunctionComponent<
  MyTasksItemOwnProps & MyTasksItemWrapperReduxProps & DispatchProp<any>
> = props => {
  const {
    useGraphQL,
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    userAcct,
    content,
    dispatch,
  } = props;

  const viewProps = {
    challengeID,
    showClaimRewardsTab,
    showRescueTokensTab,
    userAcct,
    content,
  };

  const getCharterContent = async (charterHeader: EthContentHeader) => {
    dispatch!(await getContent(charterHeader));
  };

  if (useGraphQL) {
    return (
      <MyTasksItemApolloQueryWrapper
        {...viewProps}
        queryUserChallengeData={queryUserChallengeData}
        queryUserAppealChallengeData={queryUserAppealChallengeData}
        getCharterContent={getCharterContent}
      />
    );
  }

  return <MyTasksItemReduxComponent {...viewProps} />;
};

const mapStateToPropsMyTasksItemWrapper = (
  state: State,
  ownProps: MyTasksItemOwnProps,
): MyTasksItemOwnProps & MyTasksItemWrapperReduxProps => {
  const { useGraphQL } = state;
  const { content, user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { useGraphQL, content, userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyTasksItemWrapper)(MyTasksItemWrapper);
