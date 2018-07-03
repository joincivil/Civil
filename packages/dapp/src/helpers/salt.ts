import * as store from "store";
import { randomSalt } from "@joincivil/utils";

const SALT_WORD_LENGTH = 4;

export function fetchSalt(challengeId: string, forceRefresh: boolean = false): string {
  const key = `salt:${challengeId}`;

  // See if we have it saved first.
  if (!forceRefresh) {
    const savedSalt: string = store.get(key);

    if (savedSalt) {
      return savedSalt;
    }
  }

  const salt = randomSalt(SALT_WORD_LENGTH).toFixed();

  store.set(key, salt);

  return salt;
}
