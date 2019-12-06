import { RosterMember } from "@joincivil/typescript-types";

/** Data about a wallet address that we get from the CMS. */
export type CmsUserData =
  | {
      displayName?: string;
      username?: string;
      avatarUrl?: string;
      bio?: string;
    }
  | undefined;

export interface UserData {
  rosterData: Partial<RosterMember>;
  isCmsUser?: boolean;
  username?: string;
}
