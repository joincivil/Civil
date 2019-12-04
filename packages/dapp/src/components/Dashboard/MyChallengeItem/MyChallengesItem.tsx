import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { EthContentHeader } from "@joincivil/typescript-types";

import { State } from "../../../redux/reducers";
import { getContent } from "../../../redux/actionCreators/newsrooms";
import { MyChallengesItemOwnProps, MyChallengesItemWrapperReduxProps } from "./MyChallengesItemTypes";
import MyChallengesItemWrapper from "./MyChallengesItemWrapper";
import { CivilHelperContext } from "../../../apis/CivilHelper";

const MyChallengesItem: React.FunctionComponent<
  MyChallengesItemOwnProps & MyChallengesItemWrapperReduxProps & DispatchProp<any>
> = props => {
  const {
    challenge,
    showClaimRewardsTab,
    showRescueTokensTab,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    userAcct,
    content,
    dispatch,
  } = props;

  const viewProps = {
    challenge,
    showClaimRewardsTab,
    showRescueTokensTab,
    userAcct,
    content,
  };

  const helper = React.useContext(CivilHelperContext);

  const getCharterContent = async (charterHeader: EthContentHeader) => {
    dispatch!(await getContent(helper!, charterHeader));
  };

  return (
    <MyChallengesItemWrapper
      {...viewProps}
      queryUserChallengeData={queryUserChallengeData}
      queryUserAppealChallengeData={queryUserAppealChallengeData}
      getCharterContent={getCharterContent}
    />
  );
};

const mapStateToPropsMyChallengesItem = (
  state: State,
  ownProps: MyChallengesItemOwnProps,
): MyChallengesItemOwnProps & MyChallengesItemWrapperReduxProps => {
  const { content, user } = state.networkDependent;
  const userAcct = user && user.account.account;
  return { content, userAcct, ...ownProps };
};

export default connect(mapStateToPropsMyChallengesItem)(MyChallengesItem);
