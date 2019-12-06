import { EthAddress } from "@joincivil/typescript-types";
import { CivilHelper } from "../apis/CivilHelper";

export async function getCivilianWhitelist(helper: CivilHelper, user: EthAddress): Promise<boolean> {
  const tcr = await helper.getTCR();
  const token = await tcr.getToken();
  return token.isCivilian(user);
}

export async function getUnlockedWhitelist(helper: CivilHelper, user: EthAddress): Promise<boolean> {
  const tcr = await helper.getTCR();
  const token = await tcr.getToken();
  return token.isUnlocked(user);
}
