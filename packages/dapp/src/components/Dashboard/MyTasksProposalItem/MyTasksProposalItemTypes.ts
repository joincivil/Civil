import { UserChallengeData, EthAddress } from "@joincivil/typescript-types";

export interface MyTasksProposalItemOwnProps {
  challengeID?: string;
  queryUserChallengeData?: any;
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
