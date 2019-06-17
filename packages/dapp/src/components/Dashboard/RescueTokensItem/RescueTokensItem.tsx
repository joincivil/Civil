import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../../redux/reducers";
import { RescueTokensItemOwnProps } from "./types";
import RescueTokensItemApolloQueryWrapper from "./RescueTokensApolloQueryWrapper";
import { RescueTokensItemReduxWrapper, RescueTokensProposalItemReduxWrapper } from "./RescueTokensItemReduxWrapper";

interface RescueTokensItemWrapperReduxProps {
  useGraphQL?: boolean;
}

const RescueTokensItemWrapper: React.FunctionComponent<
  RescueTokensItemOwnProps & RescueTokensItemWrapperReduxProps
> = props => {
  const {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    toggleSelect,
    useGraphQL,
  } = props;

  const viewProps = {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    toggleSelect,
  };

  if (useGraphQL) {
    return (
      <RescueTokensItemApolloQueryWrapper
        {...viewProps}
        queryUserChallengeData={queryUserChallengeData}
        queryUserAppealChallengeData={queryUserAppealChallengeData}
      />
    );
  }

  if (isProposalChallenge) {
    return <RescueTokensProposalItemReduxWrapper {...viewProps} />;
  }

  return <RescueTokensItemReduxWrapper {...viewProps} />;
};

const mapStateToPropsRescueTokensItemWrapper = (
  state: State,
  ownProps: RescueTokensItemOwnProps,
): RescueTokensItemOwnProps & RescueTokensItemWrapperReduxProps => {
  const { useGraphQL } = state;
  return { useGraphQL, ...ownProps };
};

export default connect(mapStateToPropsRescueTokensItemWrapper)(RescueTokensItemWrapper);
