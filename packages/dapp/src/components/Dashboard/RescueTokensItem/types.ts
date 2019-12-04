import { BigNumber, UserChallengeData } from "@joincivil/typescript-types";

export interface RescueTokensItemOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  isProposalChallenge?: boolean;
  queryUserChallengeData?: any;
  queryUserAppealChallengeData?: any;
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
