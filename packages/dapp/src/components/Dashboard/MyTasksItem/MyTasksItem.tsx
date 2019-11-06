import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthContentHeader } from "@joincivil/core";

import { State } from "../../../redux/reducers";
import { getContent } from "../../../redux/actionCreators/newsrooms";
import { MyTasksItemOwnProps, MyTasksItemWrapperReduxProps } from "./MyTasksItemTypes";
import MyTasksItemApolloQueryWrapper from "./MyTasksItemApolloQueryWrapper";
import { CivilHelperContext } from "../../../apis/CivilHelper";

const MyTasksItemWrapper: React.FunctionComponent<
  MyTasksItemOwnProps & MyTasksItemWrapperReduxProps & DispatchProp<any>
> = props => {
  const {
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

  const helper = React.useContext(CivilHelperContext);

  const getCharterContent = async (charterHeader: EthContentHeader) => {
    dispatch!(await getContent(helper!, charterHeader));
  };

  console.log("queryUserChallengeData: ", queryUserChallengeData);
  // return <>something</>

  return (
    <MyTasksItemApolloQueryWrapper
      {...viewProps}
      queryUserChallengeData={queryUserChallengeData}
      queryUserAppealChallengeData={queryUserAppealChallengeData}
      getCharterContent={getCharterContent}
    />
  );
};

const mapStateToPropsMyTasksItemWrapper = (
  state: State,
  ownProps: MyTasksItemOwnProps,
): MyTasksItemOwnProps & MyTasksItemWrapperReduxProps => {
  const { content, user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { content, userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyTasksItemWrapper)(MyTasksItemWrapper);
