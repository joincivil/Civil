import { UserChallengeData, EthAddress } from "@joincivil/core";

export interface MyTasksProposalItemOwnProps {
  challengeID?: string;
  queryUserChallengeData?: UserChallengeData;
  queryUserAppealChallengeData?: UserChallengeData;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface MyTasksProposalItemWrapperReduxProps {
  userAcct: EthAddress;
}

export interface MyTasksProposalItemReduxProps {
  proposal?: any;
  userChallengeData?: UserChallengeData;
  challenge?: any;
  challengeDataRequestStatus?: any;
}
