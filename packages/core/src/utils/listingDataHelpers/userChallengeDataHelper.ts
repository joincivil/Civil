import { UserChallengeData } from "../../types";

/**
 * Checks if a user committed
 * @param userChallengeData the UserChallengeData to check
 */
export function didUserCommit(userChallengeData?: UserChallengeData): boolean {
  if (userChallengeData) {
    return userChallengeData!.didUserCommit!;
  }
  return false;
}
