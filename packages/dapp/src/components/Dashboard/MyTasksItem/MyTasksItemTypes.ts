import {
  ContentData,
  ListingWrapper,
  WrappedChallengeData,
  AppealData,
  AppealChallengeData,
  UserChallengeData,
  CharterData,
  EthAddress,
  EthContentHeader,
} from "@joincivil/typescript-types";
import { NewsroomState } from "@joincivil/newsroom-signup";

export interface MyTasksItemOwnProps {
  challengeID?: string;
  queryUserChallengeData?: any;
  queryUserAppealChallengeData?: any;
  showClaimRewardsTab?(): void;
  showRescueTokensTab?(): void;
}

export interface MyTasksItemWrapperReduxProps {
  userAcct: EthAddress;
  content: Map<string, ContentData>;
  getCharterContent(charterHeader: EthContentHeader): Promise<void>;
}

export interface MyTasksItemReduxProps {
  challenge?: WrappedChallengeData;
  challengeState?: any;
  userChallengeData?: UserChallengeData;
  appeal?: AppealData;
  appealChallengeID?: string;
  appealChallenge?: AppealChallengeData;
  appealChallengeState?: any;
  appealUserChallengeData?: UserChallengeData;
  user?: EthAddress;
  newsroom?: NewsroomState;
  charter?: CharterData;
  listingAddress?: string;
  listing?: ListingWrapper;
  listingDataRequestStatus?: any;
}

export interface ViewDetailURLProps {
  listingDetailURL: string;
  viewDetailURL: string;
}

export type MyTasksItemSubComponentProps = MyTasksItemOwnProps & ViewDetailURLProps & MyTasksItemReduxProps;
