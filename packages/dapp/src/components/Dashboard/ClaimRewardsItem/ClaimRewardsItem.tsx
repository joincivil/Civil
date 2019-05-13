import * as React from "react";
import { connect } from "react-redux";
import { State } from "../../../redux/reducers";
import { ClaimRewardsItemOwnProps } from "./types";
import ClaimRewardsItemApolloQueryWrapper from "./ClaimRewardsApolloQueryWrapper";
import { ClaimRewardsItemReduxWrapper, ClaimRewardsProposalItemReduxWrapper } from "./ClaimRewardsItemReduxWrapper";

interface ClaimRewardsItemWrapperReduxProps {
  useGraphQL?: boolean;
}

const ClaimRewardsItemWrapper: React.FunctionComponent<ClaimRewardsItemOwnProps & ClaimRewardsItemWrapperReduxProps> = props => {
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
      <ClaimRewardsItemApolloQueryWrapper
        {...viewProps}
        queryUserChallengeData={queryUserChallengeData}
        queryUserAppealChallengeData={queryUserAppealChallengeData}
      />
    );
  }

  if (isProposalChallenge) {
    return <ClaimRewardsProposalItemReduxWrapper {...viewProps} />;
  }

  return <ClaimRewardsItemReduxWrapper {...viewProps} />;
};

const mapStateToPropsClaimRewardsItemWrapper = (
  state: State,
  ownProps: ClaimRewardsItemOwnProps,
): ClaimRewardsItemOwnProps & ClaimRewardsItemWrapperReduxProps => {
  const { useGraphQL } = state;
  return { useGraphQL,  ...ownProps };
};

export default connect(mapStateToPropsClaimRewardsItemWrapper)(ClaimRewardsItemWrapper);
