import { RosterMember } from "@joincivil/core";

/** Data about a wallet address that we get from the CMS. */
export type CmsUserData =
  | {
      displayName?: string;
      username?: string;
      avatarUrl?: string;
      bio?: any;
    }
  | undefined;

export interface UserData {
  rosterData: Partial<RosterMember>;
  isCmsUser?: boolean;
  username?: string;
}
