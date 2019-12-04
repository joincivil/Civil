import { UserChallengeData } from "@joincivil/typescript-types";

export const userChallengeDataHelpers = { didUserCommit };

/**
 * Checks if a user committed
 * @param userChallengeData the UserChallengeData to check
 */
function didUserCommit(userChallengeData?: UserChallengeData): boolean {
  if (userChallengeData) {
    return userChallengeData!.didUserCommit!;
  }
  return false;
}
