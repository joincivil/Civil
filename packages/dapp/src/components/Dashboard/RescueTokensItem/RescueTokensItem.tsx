import * as React from "react";
import { RescueTokensItemOwnProps } from "./types";
import RescueTokensItemWrapper from "./RescueTokensItemWrapper";

const RescueTokensItem: React.FunctionComponent<RescueTokensItemOwnProps> = props => {
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
    <RescueTokensItemWrapper
      {...viewProps}
      queryUserChallengeData={queryUserChallengeData}
      queryUserAppealChallengeData={queryUserAppealChallengeData}
    />
  );
};

export default RescueTokensItem;
