import * as React from "react";
import { RescueTokensItemOwnProps } from "./types";
import RescueTokensItemApolloQueryWrapper from "./RescueTokensApolloQueryWrapper";

const RescueTokensItemWrapper: React.FunctionComponent<RescueTokensItemOwnProps> = props => {
  const {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    queryUserChallengeData,
    queryUserAppealChallengeData,
    toggleSelect,
  } = props;

  const viewProps = {
    challengeID,
    appealChallengeID,
    isProposalChallenge,
    toggleSelect,
  };

  return (
    <RescueTokensItemApolloQueryWrapper
      {...viewProps}
      queryUserChallengeData={queryUserChallengeData}
      queryUserAppealChallengeData={queryUserAppealChallengeData}
    />
  );
};

export default RescueTokensItemWrapper;
