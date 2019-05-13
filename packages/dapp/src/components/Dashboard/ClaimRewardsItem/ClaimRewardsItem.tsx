import * as React from "react";
import { connect } from "react-redux";
import { ClaimRewardsItemOwnProps } from "./types";
import ClaimRewardsItemApolloQueryWrapper from "./ClaimRewardsApolloQueryWrapper";
import ClaimRewardsItemReduxWrapper from "./ClaimRewardsItemReduxWrapper";

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

  return <ClaimRewardsItemReduxWrapper {...viewProps} />;
};

const mapStateToPropsClaimRewardsItemWrapper = (
  state: State,
  ownProps: ActivityListItemClaimRewardOwnProps,
): ClaimRewardsItemOwnProps & ClaimRewardsItemWrapperReduxProps => {
  const { useGraphQL } = state;
  return { useGraphQL,  ...ownProps };
};

export default connect(mapStateToPropsClaimRewardsItemWrapper)(ClaimRewardsItemWrapper);
