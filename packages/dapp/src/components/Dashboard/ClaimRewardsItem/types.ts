import BigNumber from "bignumber.js";
import { UserChallengeData, NewsroomWrapper } from "@joincivil/core";

export interface ClaimRewardsItemOwnProps {
  challengeID?: string;
  appealChallengeID?: string;
  isProposalChallenge?: boolean;
  queryUserChallengeData?: UserChallengeData;
  queryUserAppealChallengeData?: UserChallengeData;
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
  proposalUserChallengeData?: UserChallengeData;
  unclaimedRewardAmount: BigNumber;
  challenge?: any;
  challengeDataRequestStatus?: any;
}
