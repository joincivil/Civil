import { BigNumber } from "@joincivil/typescript-types";
import { UserChallengeData } from "@joincivil/core";

export interface ClaimRewardsItemOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  isProposalChallenge?: boolean;
  queryUserChallengeData?: any;
  queryUserAppealChallengeData?: any;
  toggleSelect?(challengeID: string, isSelected: boolean, salt: BigNumber): void;
}

export interface ClaimRewardsViewComponentProps {
  listingAddress?: string;
  newsroom?: any;
  userChallengeData?: UserChallengeData;
  unclaimedRewardAmount: BigNumber;
}

export interface ProposalClaimRewardsComponentProps {
  proposal?: any;
  userChallengeData?: UserChallengeData;
  unclaimedRewardAmount: BigNumber;
}
