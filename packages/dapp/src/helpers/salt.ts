import * as store from "store";
import { randomSalt } from "@joincivil/utils";
import { BigNumber, EthAddress } from "@joincivil/typescript-types";
const SALT_WORD_LENGTH = 4;

export function fetchSalt(
  challengeId: BigNumber,
  user: EthAddress | undefined,
  forceRefresh: boolean = false,
): string | undefined {
  if (!user) {
    return undefined;
  }
  const key = `salt:${challengeId.toString()}:${user}`;

  // See if we have it saved first.
  if (!forceRefresh) {
    const savedSalt: string = store.get(key);

    if (savedSalt) {
      return savedSalt;
    }
  }

  const salt = randomSalt(SALT_WORD_LENGTH).toString();

  store.set(key, salt);

  return salt;
}
