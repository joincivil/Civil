import BigNumber from "bignumber.js";
import { UserChallengeData } from "@joincivil/core";

export interface RescueTokensItemOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  isProposalChallenge?: boolean;
  queryUserChallengeData?: UserChallengeData;
  queryUserAppealChallengeData?: UserChallengeData;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface RescueTokensViewComponentProps {
  listingAddress?: string;
  newsroom?: any;
  userChallengeData?: UserChallengeData;
}

export interface ProposalRescueTokensComponentProps {
  proposal?: any;
  userChallengeData?: UserChallengeData;
}
