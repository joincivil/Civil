import { UserChallengeData, EthAddress } from "@joincivil/core";

export interface MyTasksProposalItemOwnProps {
  challengeID?: string;
  queryUserChallengeData?: UserChallengeData;
  queryUserAppealChallengeData?: UserChallengeData;
  useGraphQL?: boolean;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface MyTasksProposalItemWrapperReduxProps {
  useGraphQL?: boolean;
  userAcct: EthAddress;
}

export interface MyTasksProposalItemReduxProps {
  proposal?: any;
  userChallengeData?: UserChallengeData;
  challenge?: any;
  challengeDataRequestStatus?: any;
}
